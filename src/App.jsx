//mene todos ek arra banay h jo hamare sare task ko hold karega 
//todos.map method use jisse ham sabhi todo ko dynemically dikha sake
//Basically jese hi me refresh karuga mere sare todo lost ho jayege esa na ho esliye me local storage ka use karuga
//jab array ke har ek ele ko idivizally render karana hota h to map method use karte h.
//jab bhi ham bahut sare list ke items ko create karte h such as todo list to react me har ek indivizuall iteam ke
//sath ham ek unique key associated kar dete h ese ham delete karne ke liye us item ko identify kar sakte h 
//to eske liye mene yha uuidv4() npm package ka use kar kiya h that genrate unique id for every todo(item)
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
function App() {
  //todo - > single task
  //todos - > all todos
  const[todo, setTodo] = useState("") //input val ko trak karne ke liye naye task ko state ki tarah treate kar sakte h
  const[todos, setTodos] = useState([]) //ye todos sabhi todo ko hold karega as a array form
  const[showFinished, setshowFinished] = useState(true); //ye mujhe finished todo dikhayega



  useEffect(() => { //use for lod all over the todo
    let todoString = localStorage.getItem("todos")
    if(todoString){//yadi meri todoStriung null nhi h 
    let todos = JSON.parse(localStorage.getItem("todos")); //get all over the todo
    setTodos(todos) //yaha se local storage se rerendring hogi jisse data lost nhi hoga
    }
  }, [])




  const toggleFinished = () =>{ 
     //yadi mera showfinished chek(true)-> finisd + unfinished
    //yadi unchek(false) -> unfished
    setshowFinished(!showFinished);
  }



  const handleEdit = (e, id) => {
    let t = todos.filter(i =>i.id === id)//yha se mujhe id mil jayegi jise edit karna h 
    setTodo(t[0].todo) //ese bo todo jise edit karna h bo input field me set ho jayega then edit then add
    let newTodos = todos.filter(item =>{ //ese jese hi edit input filed me set then bo todos array se lost ho jayega 
      return item.id !== id; 
    });
    setTodos(newTodos) //pure todos ko rerender kara dege kebal us id ke todo ko chhodkar jis per edit btn cleck kiya h
    saveToLS()
}



  const handleDelete = (e, id) => { //yha se niche se us todo/item ki id aayegi jiska delete btn me click karuga 
      let newTodos = todos.filter(item =>{
        return item.id !== id
      });
      setTodos(newTodos) //pure todos ko rerender kara do kebal us id ke todo ko chhodkar jis per delete btn click kiya h 
      saveToLS()
  }


  const saveToLS = () =>{ //es function se data ko me local storage me save karuga 
    localStorage.setItem("todos", JSON.stringify(todos))
  }



  const handleAdd = () => { //prev todo pass as a obj isComplete by default false hoga
    setTodos([...todos, {id:uuidv4(), todo, isCompleted: false}])//mere sabhi todo ka format yahi hoga jo mere todos me h 
     setTodo("") //ese input text todos array me add hone ke bad input dubara khali ho jayega 
     saveToLS();
  }



  const handleChange = (e) => { //jo bhi input me changes hoge use maintain karega 
    setTodo(e.target.value); //event obj se task property acces jo batati h hamara target  kon tha means input element ko bha se ham access kar rhe h 

  }



  const handleCheckbox = (e) => {
    let id = e.target.name; //yha se hame us todo ki id mil jayegi name={todo.id}
    //now yha ham toggle kar rhe h chek h to unchek or viceversa
    //mujhe us todo ko toggle karna h jiske id mujhe upper id bale varibale me milegi
    //console.log("my id is ${id}");
    let index = todos.findIndex(item =>{
      return item.id === id;
    })  //ye findIndex fun ek fun leta h or return me us todo ka index return karegaa jiski id mere upper bale varibale ki id se match kar jaye 
    let newTodos = [...todos]; //index milne ke bad me us index ko change kar duga 
    //[...todos] es tarah se copy kiya na ki direct [todo] likhkar because nhi to reference same ho jayega and task complete hone per bhi line through work nhi karega to esse todos ek nya array ban jayega
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);//yha se sabhi todos rerender ho jayege after toggle
    saveToLS()
  }


    return (
      //me empty list na create kar saku heance me add button me length of task <= 3 add kar rha hu jise length 3 se chhota koi bhi task add nhi hoga 
      < >
      <Navbar/> 
         <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%] border-[0.1px] border-black">
          <h1 className='font-bold text-center text-3xl'>iTask - Manage your todos at one place</h1>
           <div className="addTodo my-5 flex flex-col gap-4">
            <h2 className='text-2xl font-bold'>Add a Todo :</h2>
            <div className="flex">
  
            <input  onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1 border-[0.1px] border-black '/>
            <button onClick={handleAdd} disabled={todo.length<=3} className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white border-black border-[0.1px] '>Added</button>
            </div>
           </div>
           <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} /> 
           <label className='mx-2' htmlFor="show">Show Finished</label> 
           <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
           <h2 className='text-2xl font-bold'>Your Todos :</h2>
           <div className="todos">
            {todos.length ===0 && <div className='m-5'>No Todos to display currentally pleace create todo to display</div> }
            {todos.map(item=>{
   
            return (showFinished || !item.isCompleted) && <div key={item.id} className={"todo flex my-3 justify-between"}>
              <div className='flex gap-5'> 
              <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} id="" />
              <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button onClick={(e)=>handleEdit(e, item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                <button onClick={(e)=>{handleDelete(e, item.id)}} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
              </div> 
            </div>
            })}
           </div>
          
         </div>
      </>
    )
  }
  
  export default App