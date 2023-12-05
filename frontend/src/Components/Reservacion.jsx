import axios from 'axios';

//bootstrap
import { 
  Form,
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';

//react
import { 
  useEffect,
  useState
} from 'react';

//dev data
const url = 'http://localhost:3001';

//context
import { useGlobalContext } from '../App';

//my components
import DangerAlert from '../DangerAlert';

const Reservacion = () => {
  const [proximos, setProximos] = useState(null);
  const { error, setError } = useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObj = Object.fromEntries(formData.entries());

    axios({
      method: 'post',
      url: `${url}/api/vuelos/pasajero`,
      data: {
        id_vuelo: proximos[formObj.vuelo],
        nombre: formObj.nombre,
        apellido_paterno: formObj.paterno,
        apellido_materno: formObj.materno
      },
      headers: {
        'ngrok-skip-browser-warning': 1
      }
    }).then(res => {
      document.getElementById('reservacion').reset();
    }, err => {
      console.error(err);
      setError({
        show: true,
        message: err.response.data.message
      });
    });
  };

  const handleRefresh = () => {
    axios({
      method: 'get',
      url: `${url}/api/vuelos?proximos=1`,
      headers: {
        'ngrok-skip-browser-warning': 1
      }
    }).then(res => {
      let obj = {};

      res.data.data.forEach(vuelo => {
        const name = `${vuelo.origen} - ${vuelo.destino}`;
        obj[name] = vuelo.id_vuelo;
      });

      setProximos(obj);
    }, err => {
      console.error(err);
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Form id='reservacion' className='mt-5' onSubmit={handleSubmit}>
      { error.show && <DangerAlert/> }
      <Container>
        <Row className='row row-cols-1 row-cols-md-2'>
          <Col>
            <Form.Group className='mb-3' controlId='nombreField'>
              <Form.Label>
                Nombre
              </Form.Label>
              <Form.Control type='text' name='nombre' ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId='paternoField'>
              <Form.Label>
                Apellido Paterno
              </Form.Label>
              <Form.Control type='text' name='paterno' ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId='maternoField'>
              <Form.Label>
                Apellido Materno
              </Form.Label>
              <Form.Control type='text' name='materno' placeholder='Opcional'></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className='mb-3' controlId='maternoField'>
              <Form.Label>
                Vuelo
              </Form.Label>
              <Form.Select name='vuelo'>
                { proximos && 
                  Array.from(Object.entries(proximos)).map(([vuelo, id]) => {
                    return <option key={`vuelo-${id}`}>{vuelo}</option>
                  })
                }
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type='submit'>Reservar</Button>
          </Col>
        </Row>
      </Container>
    </Form>
  )
};

export default Reservacion;
