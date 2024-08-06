import React, {useState} from 'react';
import Cookies from 'js-cookie';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';

const api_url = process.env.NEXT_PUBLIC_API_URL_DEV;
const Account = () => {
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  
  const handleSignOut = async () => {
    const bearerToken: string | null= await localStorage.getItem('authToken')
    
    if (!bearerToken) {
      console.error('No auth token found');
      return;
    }
    
    const response = await fetch(api_url+'/auth/signout-cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerToken,
      },
      credentials: 'include',
    });
    
    if (response.status === 200) {
      localStorage.removeItem('authToken');
      return router.replace('/account/signin');
    } else {
      console.error('Failed to sign out');
    }
  };

  return (
    <div className='flex flex-col w-full items-center'>
      <div className='flex flex-row w-full justify-between items-center'>
        <label>Sign out</label>
        <Button type='destructive' onClick={() => setOpenDialog(true)}>Sign out</Button>
        {openDialog && 
        <Modal isOpen={openDialog} onClose={() => setOpenDialog(false)}>
          Are you sure you want to sign out? You have to sign in again.
          <Button type='destructive' onClick={handleSignOut}>Sign out</Button>
        </Modal>
        }
      </div>
    </div>
  )
}

export default Account