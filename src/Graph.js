import { useEffect, useState } from 'react'

function Graph() {
  const [pins, setPins] = useState([]);
  const files = ["/assets/espduino.json", "/assets/cncShield.json"];

  useEffect(() => {
    files.forEach((file) => {
      fetch(file)
        .then((r) => r.json())
        .then((json) => {
          setPins((cur) => [...cur, json]);
        });
    })
  }, []);

  return (
    <div className='flex'>
      {
        pins
        ? pins.map((pin) =>
        (
          <table>
            <th>ESPduino</th>
            {
              pin.map((pi) => (
                <tr className='border-2 border-black'>{pi.name}</tr>
              ))
            }
          </table>
        )
        )
        : null
      }
    </div>
  );
}

export default Graph;
