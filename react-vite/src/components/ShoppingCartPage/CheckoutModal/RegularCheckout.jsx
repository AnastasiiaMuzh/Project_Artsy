import CheckoutModal from './CheckoutModal';

const RegularCheckout = ({ setOrderPlaced, userName }) => {
  const fields = [
    { name: 'address', label: 'Address', placeholder: '123 Main Street' },
    { name: 'city', label: 'City', placeholder: 'New York' },
    { name: 'state', label: 'State', placeholder: 'NY' },
    { name: 'zipCode', label: 'Zip Code', placeholder: '10001' },
  ];

  

  return (
    <CheckoutModal
      fields={fields}
      title={`Go to checkout, ${userName}!`}
      showUserInfo={true}
      setOrderPlaced={setOrderPlaced}
    />
  );
};

export default RegularCheckout;