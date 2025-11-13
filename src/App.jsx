import {useState} from 'react'
import { X } from 'lucide-react'; 

const App = () => {

  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')

  const [task, setTask] = useState([])

  const submitHandler = (e) =>{
    e.preventDefault()
    console.log(title , details);

    let copyTask = [...task];
    // console.log(task);
  
    copyTask.push({title , details})
    // console.log(copyTask);

    setTask(copyTask)
  
    setTitle('')
    setDetails('')
    
  }

  const deleteNote =(idx) => {
    // console.log('note deleted' );
    const copyTask = [...task]
    copyTask.splice(idx,1)
     setTask(copyTask)
    
  }

  return (
    <div className='h-full text-white '>

      <h1 className='lg:text-6xl p-5 flex font-bold text-orange-500 underline underline-offset-8  justify-center sm:text-2xl'>NOTES ORGANISER</h1>

      <form onSubmit={(e) =>{
        submitHandler(e)
      }}
      className='flex flex-col gap-5 p-10 '>
         
         {/* first input for heading  */}
      <input
      className='lg:text-2xl border-2 border-white px-5 py-3 rounded-lg w-1/2 outline-none font-bold uppercase text-orange-500 hover:border-orange-500 transition-all'  
      type="text" placeholder='Enter Title'
      value={title}
      onChange={(elem) =>{
       setTitle(elem.target.value)
      }}/>
       
      {/* text area input  */}
      <textarea type="text" className='text-xl px-5 py-15 border-2 rounded-lg w-auto h-40 outline-none  leading-relaxed  hover:border-orange-500 transition-all resize-none'  placeholder='Write Details'  
      value={details}
      onChange={(e)=>{
        setDetails(e.target.value)
      }}
      />
      

      <button className='border-2 w-fit px-8 py-3 rounded-lg text-2xl bg-black text-orange-500 font-bold outline-none active:bg-orange-500 
      '>Add Notes</button>

      </form>

     
      {/* ADDED notes */}

      <div className=' p-10  '>
        <h1 className='text-3xl font-extrabold mb-10  text-orange-500 uppercase underline underline-offset-8 decoration-5'>Recent Notes</h1>
          
        <div className=' flex flex-col gap-5 overflow-auto h-full'>

       { task.map(function(elem, idx){

          return <div key={idx} className='relative flex justify-between items-center border border-gray-600 rounded-lg p-4 hover:border-orange-500 transition-all '>

          <h2 onClick={()=>{
            deleteNote(idx)
          }} className='text-white mr-4 bg-orange-500 rounded-lg cursor-pointer active:scale-90'>  <X /></h2>

          <h3 className='text-xl font-bold uppercase text-white w-1/3'>{elem.title}</h3>

         <p className=' text-gray-200 w-2/3 text-lg'>{elem.details}</p>
        </div>
        })}
        
        </div>
      </div>

      
    </div>
  )
}

export default App