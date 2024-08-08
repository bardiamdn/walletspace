import Modal from "./Modal"

type AddTransactionProps = {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      Hello
    </Modal>
  )
}

export default AddTransaction