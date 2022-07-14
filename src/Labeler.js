import { useState, useEffect, useRef } from "react";

const labelFile = "/assets/cncShield.json";
const mapFile = null;
const bgImage = "/assets/cncShield.png";

function Labeler() {
  const [pins, setPins] = useState([]);
  const [tempPin, setTempPin] = useState();
  const [inputHidden, setInputHidden] = useState(true);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [hovered, setHovered] = useState(null);
  const inputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!labelFile) return;

    fetch(labelFile)
      .then((r) => r.json())
      .then((json) => {
        const pinmap = json;
        if (mapFile) {
          fetch(mapFile)
            .then((r) => r.json())
            .then((json) => {
              json.forEach((replacement) => {
                for (let i = 0; i < pinmap.length; i++) {
                  if (pinmap[i].name === replacement.target) pinmap[i].name = replacement.source;
                }
              });
              setPins(pinmap);
            })
        }
        setPins(pinmap);
      });

  }, []);

  useEffect(() => {
    setDimensions({
      height: imageRef.current.clientHeight,
      width: imageRef.current.clientWidth,
      left: imageRef.current.offsetLeft,
      top: imageRef.current.offsetTop
    });
  }, [imageRef?.current?.clientHeight]);

  useEffect(() => {
    inputRef.current.focus();
    if (inputHidden === true) console.log(pins);
  }, [inputHidden]);

  return (
    <div className="flex justify-center items-center">
      <img alt={''} ref={imageRef} src={bgImage} className="h-screen" />
      <input ref={inputRef} type="text" onKeyPress={(e) => {
        if (e.key === 'Enter') {
          setPins((cur) => [...cur, { ...tempPin, name: e.target.value }]);
          setInputHidden(true);
        }
      }} className={`${inputHidden ? "hidden" : null} absolute h-16 w-1/2 z-20 border-black border-8 text-2xl`} />
      <div style={dimensions} className="absolute border-red-500 border-2" onClick={(e) => {
        setTempPin({ left: `${(e.pageX - dimensions.left) / dimensions.width * 100}%`, top: `${(e.pageY - dimensions.top) / dimensions.height * 100}%` });
        setInputHidden(false);
      }}>
        {
          pins.map((pin) => {
            return (
              <div style={{ left: pin.left, top: pin.top }} onMouseLeave={() => setHovered(null)} onMouseEnter={() => setHovered(pin.name)} className={`${hovered === pin.name ? 'bg-green-500' : 'bg-black'} w-7 h-7 absolute transform -translate-x-1/2 -translate-y-1/2 text-white`}>
                {pin.name}
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default Labeler;
