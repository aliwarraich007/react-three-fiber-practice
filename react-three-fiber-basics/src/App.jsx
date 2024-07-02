
import './App.css'
import {Canvas, useFrame} from "@react-three/fiber";
import {useRef, useState} from "react";
import {MeshWobbleMaterial, OrbitControls, useHelper} from "@react-three/drei";
import {DirectionalLightHelper} from "three";
import {useControls} from "leva";

function App() {

  const Cube = ({position, size, color}) => {
    const ref = useRef();
    useFrame((state, delta) => {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta * 2.0;
      ref.current.position.z = (Math.sin(state.clock.elapsedTime)) * 2.0;
    })
    return (
     <mesh position={position} ref={ref}>
       <boxGeometry args={size}/>
       <meshStandardMaterial color={color}/>
     </mesh>
    )
  }

  const Sphere = ({position, size, color}) => {
    const ref = useRef();
    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    useFrame((state, delta) => {
      const speed = hovered ? 1 : 0.5
      ref.current.rotation.y += delta * speed;
    })
    return (
     <mesh
      position={position} ref={ref}
      onPointerEnter={(event) => (event.stopPropagation, setHovered(true))}
     onPointerLeave={() => setHovered(false)}
      onClick={() => setClicked((!clicked))}
      scale={clicked ? 1.5 : 1}
     >
       <sphereGeometry args={size}/>
       <meshStandardMaterial color={hovered ? "green" : "white"} wireframe/>

     </mesh>
    )
  }

  const Torus = ({position, size, color}) => {
    return (
     <mesh position={position}>
       <torusGeometry args={size}/>
       <meshStandardMaterial color={color}/>
     </mesh>
    )
  }

  const TorusKnot = ({position, size}) => {
    const {color, radius} = useControls({
      color: 'white',
      radius: {
        value: 5,
        min: 0,
        max: 10,
        step: 0.1
      }
    })
    return (
     <mesh position={position}>
       <torusKnotGeometry args={[radius, ...size]}/>
       {/*<meshStandardMaterial color={color}/>*/}
      <MeshWobbleMaterial color={color}/>
     </mesh>
    )
  }

  const Scene = () => {

    const directionalLightRef = useRef();
    useHelper(directionalLightRef, DirectionalLightHelper, 0.5, 'white')
    const {lightColor, lightIntensity} = useControls({
      lightColor: "white",
      lightIntensity: {
        value: 2.5,
        min: 0,
        max: 5,
      }
    })
    return (
     <>
       <directionalLight
        position={[0, 2, 0]}
        ref={directionalLightRef}
        color={lightColor}
       intensity={lightIntensity}
       />
       {/*<ambientLight intensity={0.5}/>*/}
       {/*<Cube color={'orange'} side={[1, 1, 1]} position={[1, 0, 0]} />*/}
       {/*<Sphere position={[0, 0, 0]} size={[1, 30, 30]} color={'green'}/>*/}
       {/*<Torus position={[2, 0, 0]} size={[0.8, 0.2, 30, 30]} color={'blue'}/>*/}
       <TorusKnot position={[0, 0, 0]} size={[ 0.1, 1000, 50]}/>
       <OrbitControls enableZoom={false}/>
     </>
    )
  }

  return (
   <>
     <Canvas>
        <Scene/>
     </Canvas>
   </>
  )
}

export default App
