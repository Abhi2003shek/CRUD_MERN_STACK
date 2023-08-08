import { useState, useEffect, } from 'react';
import './App.css';
import axios from 'axios';
import { Form } from './components/Form';

axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [addSection,setSection] = useState(false);
  const [formData, setFormData] = useState({
    name : "",
    email : "",
    mobile : ""
  })
  const [formDataEdit, setFormDataEdit] = useState({
    name : "",
    email : "",
    mobile : "",
    _id :""
  })
  const [editSection, setEditSection] = useState(false);

  const [dataList, setDataList] = useState([]);

  const handleOnChange = (e)=>{
    const {value,name} = e.target;
    setFormData((preve)=>{
      return{
        ...preve, //prevent for deleting previous data
        [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{ //adding data to the mongoDB
    e.preventDefault();
    const data = await axios.post("/create",formData);
    console.log(data);
    if(data.data.success){
      setSection(false);
      alert(data.data.message);
      getFetchData();
    }
  }
  const getFetchData = async()=>{
    const data = await axios.get("/");
    console.log(data);
    if(data.data.success){
      setDataList(data.data.Data);
    }
  }
  useEffect(()=>{
    getFetchData();
  },[]);

  const handleDelete = async(id)=>{
    const data = await axios.delete("/delete/"+id);
    if(data.data.success){
      getFetchData();
      alert(data.data.message);
    }
  }

  const handleUpdate = async(e)=>{
    e.preventDefault();
    const data = await axios.put("/update",formDataEdit);
    if(data.data.success){
      getFetchData();
      alert(data.data.message);
      setEditSection(false);

    }
  }
  const handleEditOnChange = async(e)=>{
    const {value,name} = e.target;
    setFormDataEdit((preve)=>{
      return{
        ...preve, //prevent for deleting previous data
        [name] : value
      }
    })
  }
  const handleEdit = (el)=>{
    setFormDataEdit(el);
    setEditSection(true);
  }
  return (
    <>
    <div className='container'>
      <button className='btn btn-add' onClick={()=>setSection(true)}>Add</button>
      
      {
        addSection && (
      <Form
      handleSubmit = {handleSubmit}
      handleOnChange = {handleOnChange}
      handleClose = {()=>setSection(false)}
      rest = {formData}
      />
      )
      }
      {
        editSection && (
      <Form
      handleSubmit = {handleUpdate}
      handleOnChange = {handleEditOnChange}
      handleClose = {()=>setEditSection(false)}
      rest = {formDataEdit}
      />
      )
      }
      <div className='tableContainer'>
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Operations</th>
          </tr>
          </thead>
          <tbody>
            {
              dataList.map((el)=>{
                return(
                  <tr>
                    <td>{el.name}</td>
                    <td>{el.email}</td>
                    <td>{el.mobile}</td>
                    <td>
                        <button className='btn btn-edit' onClick={()=>handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={()=>handleDelete(el._id)}>Delete</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

    </div>
    </>
  );
}

export default App;
