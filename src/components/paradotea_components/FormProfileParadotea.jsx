import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom'
import '../../custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiBaseUrl from '../../apiConfig';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Knob } from 'primereact/knob';
import { Calendar } from 'primereact/calendar';

const FormProfileParadotea=() =>{
    const[part_number,setPart_Number]=useState("");
    const[title,setTitle]=useState("");
    const[delivery_date,setDelivery_Date]=useState("");
    const[percentage,setPercentage]=useState("");
    const[erga_id,setErga_id]=useState("");
    const[timologia_id,setTimologia_id]=useState("");
    const[ammount,setAmmount]=useState("");
    const[ammount_vat,setAmmount_Vat]=useState("");
    const[ammount_total,setAmmount_Total]=useState("");
    const[estimate_payment_date,setEstimate_Payment_Date]=useState("");
    const[estimate_payment_date_2,setEstimate_Payment_Date_2]=useState("");
    const[estimate_payment_date_3,setEstimate_Payment_Date_3]=useState("");

    const[msg,setMsg]=useState("");

    const navigate = useNavigate();

    const{id} = useParams();

    useEffect(()=>{
        const getParadoteaById = async()=>{
            try
            {
                const response=await axios.get(`${apiBaseUrl}/paradotea/${id}`);
                setPart_Number(response.data.part_number);
                setTitle(response.data.title);
                setDelivery_Date(response.data.delivery_date);
                setPercentage(response.data.percentage);
                setErga_id(response.data.erga_id);
                setTimologia_id(response.data.timologia_id);
                setAmmount(response.data.ammount);
                setAmmount_Vat(response.data.ammount_vat);
                setAmmount_Total(response.data.ammount_total);
                setEstimate_Payment_Date(response.data.estimate_payment_date);
                setEstimate_Payment_Date_2(response.data.estimate_payment_date_2);
                setEstimate_Payment_Date_3(response.data.estimate_payment_date_3);
            }
            catch(error)
            {
                if(error.response){
                    setMsg(error.response.data.msg);
                }
            }
        };
        getParadoteaById();
    },[id]);

    return(
<div>
<div className="surface-0">
    <div className="font-medium text-3xl text-900 mb-3">Παραδοτέο</div>
    <div className="text-500 mb-5">Στοιχεία</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Title</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{title}</div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ανήκει στο Εργο:</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label={erga_id} className="mr-2" />
                
            </div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Αριθμός Παραδοτέου</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{part_number}</div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ημερομηνία Παράδοσης</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">

            <Calendar value={new Date(delivery_date)} inline showWeek />


            </div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
   

        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Ποσοστό</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
            
            <Knob value={percentage}  />

             </div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
    </ul>
</div>
<Divider />

<div className="grid">
  
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">ΑΡΧΙΚΟ ΠΟΣΟ</span>
                    <div className="text-900 font-medium text-xl">{ammount} €</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">ΠΟΣΟ Φ.Π.Α.</span>
                    <div className="text-900 font-medium text-xl">{ammount_vat} €</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">ΣΥΝΟΛΙΚΟ ΠΟΣΟ</span>
                    <div className="text-900 font-medium text-xl">{ammount_total} €</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">%52+ </span>
            <span className="text-500">since last week</span>
        </div>
    </div>

 
    <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Comments</span>
                    <div className="text-900 font-medium text-xl">152 Unread</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-comment text-purple-500 text-xl"></i>
                </div>
            </div>
            <span className="text-green-500 font-medium">85 </span>
            <span className="text-500">responded</span>
        </div>
    </div>
</div>
</div>
      
//         <div>
// 			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossorigin="anonymous" />
// <div className="container">
//     <div className="row">
//       <div className="col-lg-5 col-md-6">
//         <div className="mb-2 d-flex" style={{zIndex:"10"}}>
//         </div>
//         <div className="mb-2 d-flex">

//         </div>

        
        
//       </div>
//       <div className="col-lg-7 col-md-6 pl-xl-3">
        
//         <div className='box'>
//           <div className="mb-2 d-flex">
//             <h2 style={{fontWeight:'bolder', fontSize:'35px'}} >{title}</h2>
            
//           </div>
        
//         <div className="mb-2 d-flex">
          
//           <ul className="list-unstyled">
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΑΡΙΘΜΟΣ ΠΑΡΑΔΟΤΕΟΥ: &nbsp;</span><label className="media-body"> {part_number}</label>
//             </li>
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ: &nbsp; </span>
//               <label className="media-body"> {delivery_date}</label>
//             </li>
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟΣΤΟ ΕΠΙ ΤΟΥ ΣΥΜΒΑΤΙΚΟΥ: &nbsp;</span>
//               <label className="media-body"> {percentage}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ERGO id: &nbsp;</span>
//               <label className="media-body"> {erga_id}</label>
//             </li>
//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΤΙΜΟΛΟΓΙΟ id: &nbsp;</span>
//               <label className="media-body"> {timologia_id}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΑΡΧΙΚΟ ΠΟΣΟ: &nbsp;</span>
//               <label className="media-body"> {ammount}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΟΣΟ ΦΠΑ: &nbsp;</span>
//               <label className="media-body"> {ammount_vat}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΣΥΝΟΛΙΚΟ ΠΟΣΟ: &nbsp;</span>
//               <label className="media-body"> {ammount_total}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 1 : &nbsp;</span>
//               <label className="media-body"> {estimate_payment_date}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 2 : &nbsp;</span>
//               <label className="media-body"> {estimate_payment_date_2}</label>
//             </li>

//             <li className="media">
//               <span className="w-5 text-black font-weight-normal">ΠΡΟΒΛΕΠΟΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ 3 : &nbsp;</span>
//               <label className="media-body"> {estimate_payment_date_3}</label>
//             </li>
           
            

//           </ul>
//         </div>
        
       
          

//           </div>
    
//       </div>


      
//     </div>
//   </div>
// 		</div>
    );
}

export default FormProfileParadotea;