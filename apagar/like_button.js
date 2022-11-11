'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(LikeButton));


/*
const ROWS = {
  rows: [
    {
     title: 'Homer Simpson',
     cells: [
        {
          name: 'Homer Simpson'
        },
        {
          name: 'Marge Simpson'
        },
        {
          name: 'Bart Simpson'
        },
        {
          name: 'Lisa Simpson'
        },
        {
          name: 'Maggie Simpson'
        }
      ]
    },
    {
      title: 'Marge Simpson'
    },
    {
      title: 'Bart Simpson'
    },
    {
      title: 'Lisa Simpson'
    },
    {
      title: 'Maggie Simpson'
    },
    {
      title: 'Santas Little Helper',
      cells: [
        {
          name: 'Abraham Simpson'
        },
        {
          name: 'Santas Little Helper'
        },
        {
          name: 'Snowball II/V'
        },
        {
          name: 'Apu Nahasapeemapetilon'
        }, 
        {
          name: 'Barney Gumble'
        }
      ]
    },
    {
      title: 'Chief Clancy Wiggum',
      cells: [
        {
          name: 'Chief Clancy Wiggum'
        },
        {
          name: 'Ralph Wiggum'
        },
        {
          name: 'Edna Krabappel'
        },
        {
          name: 'Kent Brockman'
        },
        {
         name: 'Krusty the Clown' 
        }
      ]
    },
    {
      title: 'Milhouse Van Houten',
      cells: [
        {
          name: 'Milhouse Van Houten'
        },
        {
          name: 'Martin Prince'
        },
        {
          name: 'Moe Szyslak'
        },
        {
          name: 'Montgomery Burns'
        },
        {
          name: 'Ned Flanders'
        }
      ]
    }
  ] 
}
const AppContext = createContext()

const AppState = ({children}) => {
  let initialState = {...ROWS, position: {x: 0, y: 0}, movingRow: 0}
  
  let reducer = (state, action) => {
    if (action.type === "MOVE_ROW") {
      let copy = [...state.rows];
      let moverow = state.rows[action.payload.row];
      copy.splice(action.payload.row, 1);
      copy.splice(action.payload.droprow, 0, moverow);
      return { ...state, rows: copy }
    } else if (action.type === "DRAG_ROW") {
      return { ...state, position: {x: action.payload.x, y: action.payload.y}, movingRow: action.payload.movingrow }
    } else if (action.type === "MOVE_CELL") {
      return { ...state }
    }
  }
  
  let [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

const Row = (props) => {
  const baseClass = 'row';
  const rowElement = useRef(null);
  const [freezeClass, setFreezeClass] = useState('');
  const [ moveClass, setMoveClass ] = useState('');
  const [ staticWidth, setStaticWidth ] = useState('0px');
  const [ isDragging, setIsDragging ] = useState(false);
  const [draggingX, setDraggingX] = useState(0);
  const [draggingY, setDraggingY] = useState(0);
  const { state, dispatch } = useContext(AppContext);
  
  useEffect(() => {
    setStaticWidth(`${rowElement.current.parentElement.offsetWidth}px`);
  }, [window.innerHeight, window.innerWidth]);
  
  useEffect(() => {
    if(isDragging) {
      // setDraggingX(rowElement.parentElement.getClientRects()[0].x + state.position.x);
      // setDraggingY(rowElement.parentElement.getClientRects()[0].y + state.position.y);
      return;
    }
    if(hitTest(state.position.x, state.position.y)) {
      if(state.movingRow > props.rowindex) {
        setMoveClass('over-above');
      } else {
        setMoveClass('over-under');
      }
    } else {
      setMoveClass('');
    }
  },[state.position]);

  
  useEffect(() => {
    setMoveClass('');
  }, [state.rows])
  
  const hitTest = (x, y) => {
    let coords = rowElement.current.getClientRects()[0]
    return (
      x > coords.x &&
      x < coords.x + coords.width &&
      y > coords.y &&
      y < coords.y + coords.height
    )
  }
  
  const startMoveRow = (e) => {
    setIsDragging(true);
    dispatch({ type: "DRAG_ROW", payload:{x: e.clientX, y: e.clientY, movingrow: props.rowindex}});
  }
  
  const moveRow = (e) => {
    if (isDragging) {
      dispatch({ type: "DRAG_ROW", payload:{x: e.clientX, y: e.clientY, movingrow: props.rowindex}});
    }
  }
  
  const getDropRow = (x, y) => {
    let dropRow = null;
    let dropAreas = document.elementsFromPoint(x, y);
    dropAreas.forEach(element => {
      if(element.classList.contains(baseClass) && !element.classList.contains('active-drag')) {
        dropRow = element.dataset.index;
      }
    })
    return dropRow;
  }
  
  const stopMoveRow = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    setMoveClass('');
    let dropRow = getDropRow(e.clientX, e.clientY);
    if (dropRow === null) return;
    dispatch({ type: "MOVE_ROW", payload:{row: props.rowindex, droprow:dropRow} });
  }
  return (
    <div ref={rowElement} data-index={props.rowindex} style={{width: `${isDragging ? staticWidth : '100%'}`, left: `${isDragging ? state.position.x : '0'}px`, top:`${isDragging ? state.position.y : '0'}px`}} className={`${baseClass} ${moveClass} ${isDragging ? 'active-drag' : ''}`}>
      <div className='cell'>
        {props.children}
        <div className="handle" onMouseDown={startMoveRow} onMouseMove={moveRow} onMouseUp={stopMoveRow}></div>
      </div>
  </div>
  )
}


const Table = (props) => {
  const { state, dispatch } = useContext(AppContext);
  
  return (
    <div className="table">
      {state.rows.map((row, rowindex) => {
        return (
         <Row rowindex={rowindex}>
          {row.title}
        </Row>
        )
      })}
     </div>
  )
}

const App = () => {
  return (
    <AppState>
      <Table />
    </AppState>
  )
}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

*/