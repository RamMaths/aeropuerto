import axios from 'axios';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

//react
import { 
  useEffect,
  useState
} from 'react';
//bootstrap
import {
  Table, 
  Container,
  Button
} from 'react-bootstrap'
//css
import '../App.css'

const url = 'http://localhost:3001';

function Monitoreo() {
  const [actuales, setActuales] = useState(null);
  const [proximos, setProximos] = useState(null);

  const handleRefresh = () => {
    axios({
      method: 'get',
      url: `${url}/api/vuelos?actuales=1`,
      headers: {
        'ngrok-skip-browser-warning': 1
      }
    }).then(res => {
      setActuales(res.data.data);
    }, err => {
      console.error(err);
    });

    axios({
      method: 'get',
      url: `${url}/api/vuelos?proximos=1`,
      headers: {
        'ngrok-skip-browser-warning': 1
      }
    }).then(res => {
      setProximos(res.data.data);
    }, err => {
      console.error(err);
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div>
      <h1 className='text-center p-3'>Vuelos inactivos</h1>
      <div className='p-3'>
        <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
          <thead>
            <tr className='align-middle text-center'>
              <th>Id</th>
              <th>Avion</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Asientos Ocupados</th>
            </tr>
          </thead>
          <tbody className='align-middle text-center'>
            {
              proximos && proximos.map(vuelo => {
                return (
                  <tr key={vuelo.id_vuelo}>
                    <td>{vuelo.id_vuelo}</td>
                    <td>{vuelo.avion}</td>
                    <td>{vuelo.origen}</td>
                    <td>{vuelo.destino}</td>
                    <td>{vuelo.asientos_ocupados}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      
      <h1 className='text-center p-3'>Vuelos activos</h1>
      <div className='p-3'>
        <Table className='shadow-sm' responsive={window.innerWidth <= 750} striped bordered hover>
          <thead>
            <tr className='align-middle text-center'>
              <th>Id</th>
              <th>Avion</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Asientos Ocupados</th>
            </tr>
          </thead>
          <tbody className='align-middle text-center'>
            {
              actuales && actuales.map(vuelo => {
                return (
                  <tr key={vuelo.id_vuelo}>
                    <td>{vuelo.id_vuelo}</td>
                    <td>{vuelo.avion}</td>
                    <td>{vuelo.origen}</td>
                    <td>{vuelo.destino}</td>
                    <td>{vuelo.asientos_ocupados}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>

      <Container>
        <Button onClick={handleRefresh} className='bg-secondary border-0'><i className='bi bi-arrow-clockwise'></i></Button>
      </Container>

      {
        actuales && actuales.length > 0 && (
        <div className='p-3 justify-content-center align-items-center w-100'>
          <MapContainer center={[actuales[0].latitud, actuales[0].longitud]} zoom={13} scrollWheelZoom={false} style={{ width: "100%", height: "50vh" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
              actuales && actuales.map(avion => {
                return (
                  <Marker position={[avion.latitud, avion.longitud]} key={avion.id_vuelo}>
                    <Popup>
                      Vuelo: {avion.id_vuelo}
                    </Popup>
                  </Marker>
                );
              })
            }
          </MapContainer>
        </div>)
      }
    </div>
  )
}

export default Monitoreo;
