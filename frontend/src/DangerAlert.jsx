import { useGlobalContext } from './App';

//bootstrap components
import { Button, Alert } from 'react-bootstrap';

const DangerAlert = () => {

  const { error, setError } = useGlobalContext();

  return (
    <Alert className='sticky-top m-3' variant="danger" onClose={() => setError({...error, show: false})} dismissible>
      <Alert.Heading>Alerta</Alert.Heading>
      <p>
        {error.message}
      </p>
    </Alert>
  );
};

export default DangerAlert;

