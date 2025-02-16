import CheckoutModal from './CheckoutModal';

const GiftCheckout = ({ setOrderPlaced, userName }) => {
  const fields = [
    { name: 'firstName', label: 'First Name', placeholder: 'John' },
    { name: 'lastName', label: 'Last Name', placeholder: 'Doe' },
    { name: 'email', label: 'Email', placeholder: 'john.doe@example.com', type: 'email' },
    { name: 'address', label: 'Address', placeholder: '123 Main Street' },
    { name: 'city', label: 'City', placeholder: 'New York' },
    { name: 'state', label: 'State', placeholder: 'NY' },
    { name: 'zipCode', label: 'Zip Code', placeholder: '10001' },
    { name: 'message', label: 'Message (optional)', type: 'textarea' },
  ];

  return (
    <CheckoutModal
      fields={fields}
      title={`Gift Checkout for, ${userName}`}
      showUserInfo={false}
      setOrderPlaced={setOrderPlaced}
    />
  );
};

export default GiftCheckout;