import React from 'react';
import Button from '@/components/Button';
import { FaHome } from 'react-icons/fa';

export default function Index() {
  return (
    <div className="w-6/12">
      <div className='p-5'>
        <Button className='m-1' type='primary' >primary</Button>
        <Button className='m-1' type='submit' >submit</Button>
        <Button className='m-1' type='secondary' >secondary</Button>
        <Button className='m-1' type='outline' >outline</Button>
        <Button className='m-1' type='link' >link</Button>
        <Button className='m-1' type='icon' ><FaHome size={24}/></Button>
        <Button className='m-1' type='destructive' >destructive</Button>
      </div>
      <h1>Welcome to My Application</h1>
      <h2>Section Heading</h2>
      <h3>Subsection Heading</h3>
      <p >This is a paragraph demonstrating the body text style in design system. It includes enough text to show how a paragraph might look in your application.</p>
      <Button type='link' href="#">This is a link</Button>
      <Button >Click Me</Button>
      <input type="text" placeholder="Type here..." />
      <div className="mt-4 flex items-center">
        <input type="checkbox" id="checkbox" />
        <label htmlFor="checkbox" >CheckBox</label>
      </div>
      <div className="mt-4">
        <select >
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      </div>
      <div className="mt-4">
        <ul>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>List Item 3</li>
        </ul>
      </div>
    </div>
  );
}
