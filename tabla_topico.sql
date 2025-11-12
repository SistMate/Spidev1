CREATE TABLE topico (
    id SERIAL PRIMARY KEY,              
    nombre VARCHAR(255) NOT NULL,      
    descripcion TEXT,                  
    url_video TEXT,                     
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);