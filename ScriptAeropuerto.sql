CREATE TABLE Ciudades (
  id_ciudad SERIAL NOT NULL,
  nombre_cd VARCHAR(30) NULL,
  CONSTRAINT pk_id_ciudad PRIMARY KEY(id_ciudad)
);

CREATE TABLE Aeropuertos (
  id_aeropuerto SERIAL NOT NULL,
  id_ciudad INTEGER NOT NULL,
  nombre VARCHAR(50) NULL,
  pais VARCHAR(30) NULL,
  codigo_iata CHAR(3) NULL,
  codigo_icao CHAR(4) NULL,
  CONSTRAINT pk_id_aeropuerto PRIMARY KEY(id_aeropuerto),
  CONSTRAINT fk_id_ciudad FOREIGN KEY (id_ciudad) REFERENCES Ciudades(id_ciudad)
);

CREATE TABLE Aviones (
  id_avion SERIAL NOT NULL,
  capacidad INTEGER,
  latitud INTEGER,
  longitud INTEGER,
  CONSTRAINT pk_id_avion PRIMARY KEY (id_avion)
)

CREATE TABLE Vuelos (
  id_vuelo SERIAL NOT NULL,
  id_avion INTEGER NOT NULL,
  id_origen INTEGER NULL,
  id_destino INTEGER NULL,
  fecha_salida DATE NULL,
  fecha_llegada DATE NULL,
  CONSTRAINT pk_id_vuelo PRIMARY KEY (id_vuelo),
  CONSTRAINT fk_id_avion FOREIGN KEY (id_avion) REFERENCES Aviones(id_avion),
  CONSTRAINT fk_id_origen FOREIGN KEY (id_origen) REFERENCES Aeropuertos(id_aeropuerto),
  CONSTRAINT fk_id_destino FOREIGN KEY (id_destino) REFERENCES Aeropuertos(id_aeropuerto)
);

CREATE TABLE Pasajeros (
  id_pasajero SERIAL NOT NULL,
  id_vuelo INTEGER NOT NULL,
  nombre VARCHAR(30) NULL,
  apellido_materno VARCHAR(30) NULL,
  apellido_paterno  VARCHAR(30) NULL,
  CONSTRAINT pk_id_pasajero PRIMARY KEY (id_pasajero),
  CONSTRAINT fk_id_vuelo FOREIGN KEY (id_vuelo) REFERENCES Vuelos(id_vuelo)
);
