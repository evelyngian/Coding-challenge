import { useEffect, useState } from "react";
import "./app.css";

import { getPokemon, getAllPokemon } from './pokemon';

function App() {
  
  const [pokemonData, setPokemonData] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  const initialURL = 'https://pokeapi.co/api/v2/pokemon'
  const[filterVal, setFilterVal] = useState("");
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  


  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL)
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      
    };
     fetchData();
  }, []);

  const next = async () => {
    
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
   
  }

  const prev = async () => {
    if (!prevUrl) return;
    
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    
  }

  

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(data.map(async pokemon => {
      let pokemonRecord = await getPokemon(pokemon)
      return pokemonRecord
    }))
    setPokemonData(_pokemonData);
    setSearchApiData(_pokemonData);
  }

  const handleFilter=(e) => {
    if(e.target.value == '') {
      setPokemonData(searchApiData)
    } else {
      const filterResult = searchApiData.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
      setPokemonData(filterResult)   
    }
    setFilterVal(e.target.value)
  }
 

  return (
    <div className="app">
      <div>
        <input
          className="search"
          placeholder="Search..." 
          value={filterVal} 
          onInput={(e)=>handleFilter(e)}
          
         
        /> 
        </div>

        <table>
        <tbody>
          <tr>
            <th>PROFILE</th>
            <th>NAME</th>
            <th>TYPE</th>
            <th>HP</th>
            <th>ATTACK</th>
            <th>DEFENSE</th>
            
          </tr>
          
          {pokemonData.map((item) => (
            <tr key={item.id}>
              
              <td><img src={item.sprites.front_default} alt="" /> 
              </td>
              <td>{item.name}</td>
              <td> {
                      item.types.map(type => {
                          return (
                              <div >
                                  {type.type.name}
                              </div>
                          )
                      })
                    }</td>
              <td>{item.stats[0].base_stat}</td>
              <td>{item.stats[1].base_stat}</td>
              <td>{item.stats[2].base_stat}</td>
            </tr>
          ))}
        </tbody>
      </table>
         <p>
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </p>
      </div>
      );
}

export default App;