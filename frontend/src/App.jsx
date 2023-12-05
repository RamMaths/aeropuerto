//react
import { 
  useState,
  useContext,
  createContext
} from 'react'

//bootstrap
import { 
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap'

//my components
import Monitoreo from './Components/Monitoreo';
import Reservacion from './Components/Reservacion';

//Global Context
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

function App() {
  const [monitorear, setMonitorear] = useState(false);
  const [reservacion, setReservacion] = useState(false);
  const [error, setError] = useState({
    show: false,
    message: ''
  });

  const handleMonitorear = () => {
    setMonitorear(true);
    setReservacion(false);
  };

  const handleReservacion = () => {
    setReservacion(true);
    setMonitorear(false);
  };

  return (
    <GlobalContext.Provider value={{error, setError}}>
      <Row className='p-3 bg-light shadow-lg rounded'>
        <Col className='d-flex justify-content-center align-items-center'>
          <Button type='button' onClick={handleMonitorear}>Monitorear</Button>
        </Col>
        <Col className='d-flex justify-content-center align-items-center'>
          <Button type='button' onClick={handleReservacion}>Reservación</Button>
        </Col>
      </Row>

      <Container>
        {monitorear && <Monitoreo/>}
        {reservacion && <Reservacion/>}
      </Container>
    </GlobalContext.Provider>
  )
}

export default App
