import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';

import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';


const TimologiaList = () => {
    const [Timologia, setTimologia] = useState([]);
    const {user} = useSelector((state) => state.auth)

    const [statuses] = useState(['yes', 'no']);

    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    // const [timologia, setTimologio]=useState([]);
    const [erga, setErgo]=useState([]);

    
    useEffect(()=>{
        getTimologia()
        setLoading(false);
        initFilters();
    }, []);

    const getTimologia = async() =>{
        // const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
        // setTimologia(response.data);

        try {
            const response = await axios.get(`${apiBaseUrl}/timologia`, {timeout: 5000});
            const paraData = response.data;
            console.log("ParaData:",paraData);
            // Extract unique statuses
            //const uniqueProjectManager = [...new Set(ergaData.map(item => item.project_manager))];
            // const uniqueTimologia = [...new Set(paraData.map(item => item.timologia?.invoice_number || 'N/A'))];
        
            // console.log("Unique Timologia:",uniqueTimologia);
            // setTimologio(uniqueTimologia);

            // const uniqueErga= [...new Set(paraData.map(item => item.erga?.name || 'N/A'))];
            // setErgo(uniqueErga);

            // Convert sign_date to Date object for each item in ergaData
            const parDataWithDates = paraData.map(item => ({
                ...item,
                // erga: {
                //     ...item.erga,
                //     name: item.erga?.name || 'N/A'
                // },
                // timologia: {
                //     ...item.timologia,
                //     invoice_number: item.timologia?.invoice_number || 'N/A'
                // },
                invoice_date: new Date(item.invoice_date),
                ammount_no_tax: parseFloat(item.ammount_no_tax),
                ammount_tax_incl: parseFloat(item.ammount_tax_incl),
                ammount_of_income_tax_incl: parseFloat(item.ammount_of_income_tax_incl),
                actual_payment_date: new Date(item.actual_payment_date),
                ErgaName:""
            }));
            try {
                const response = await axios.get(`${apiBaseUrl}/paradotea`, {timeout: 5000});
                const paraErgaData = response.data;
                
                const mergedTimParData=parDataWithDates.map(parDataWithDates=>{
                    parDataWithDates.ErgaName=paraErgaData.find(paraErgaData=>paraErgaData.timologia_id===parDataWithDates.id).erga.name
                })
                // console.log("merged ",mergedTimParData)

            } catch (error) {
                console.error('Error fetching data2:', error);
            }

            const uniqueErgaNames = [...new Set(parDataWithDates.map(item =>item.ErgaName))];
            setErgo(uniqueErgaNames);
            console.log("ddsadasdasda",uniqueErgaNames)
            // const a3 = a1.map(it1 => {
            //     it1.test = a2.find(it2 => it2.id === it1.id).test
            //     return it1
            //   })
    
            const sortedParaData = parDataWithDates.sort((a, b) => a.actual_payment_date - b.actual_payment_date);

    
            console.log("what  ",sortedParaData); // Optionally log the transformed data


    
            // Assuming you have a state setter like setErga defined somewhere
            setTimologia(sortedParaData);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }





    }

    const deleteTimologio = async(timologioId)=>{
        await axios.delete(`${apiBaseUrl}/timologia/${timologioId}`);
        getTimologia();
    }



    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
 


    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },

            ErgaName: { value: null, matchMode: FilterMatchMode.IN} ,

            

            invoice_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            
            invoice_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            ammount_no_tax: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            
            ammount_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            actual_payment_date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
           
            ammount_of_income_tax_incl: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            
            comments: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            status_paid: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

            

        });
        setGlobalFilterValue('');
    };

    const ergaBodyTemplate = (rowData) => {
        
        const ergo = rowData.ErgaName || 'N/A';        // console.log("repsBodytempl",timologio)
        console.log("timologio",ergo," type ",typeof(ergo));
        console.log("rep body template: ",ergo)
    
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
                <span>{ergo}</span>
            </div>
        );
    };
    
    const ergaFilterTemplate = (options) => {
        console.log('Current timologia filter value:', options.value);
    
            return (<MultiSelect value={options.value} options={erga} itemTemplate={ergaItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    
        };
    
    
    const ergaItemTemplate = (option) => {
        // console.log("itemTemplate",option)
        console.log("rep Item template: ",option)
        console.log("rep Item type: ",typeof(option))
    
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={option} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" /> */}
                <span>{option}</span>
            </div>
        );
    };
    


    const ammount_no_taxBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_no_tax);
    };

    const ammount_tax_inclBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_tax_incl);
    };

    const ammount_of_income_tax_inclBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ammount_of_income_tax_incl);
    };


    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };



    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };
   

    const formatDate = (value) => {
        let date = new Date(value);
        if (!isNaN(date)) {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } else {
            return "Invalid date";
        }
    };


     //delivery Date
 const invoice_dateDateBodyTemplate = (rowData) => {
    return formatDate(rowData.invoice_date);
};

const invoice_dateDateFilterTemplate = (options) => {
    // console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};

    

     //delivery Date
     const actual_payment_dateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.actual_payment_date);
    };
    
    const actual_payment_dateDateFilterTemplate = (options) => {
        // console.log('Current filter value:', options);
    
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    

    const getSeverity = (status) => {
        switch (status) {
            case 'yes':
                return 'success';

            case 'no':
                return 'danger';

         
        }
    };

        

    const statusPaidBodyTemplate = (rowData) => {
        return <Tag value={rowData.status_paid} severity={getSeverity(rowData.status_paid)} />;
    };

    const statusPaidFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusPaidItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusPaidItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };




    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };



    const footer = `In total there are ${Timologia ? Timologia.length : 0} timologia.`;

    const header = renderHeader();

    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/timologia/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/timologia/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
                </Link>
                <Link to={`/timologia/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteTimologio(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }



    return(


<div className="card" >
        <h1 className='title'>Τιμολόγια</h1>
        {user && user.role ==="admin" && (
        <Link to={"/timologia/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νεου Τιμολογίου" icon="pi pi-plus-circle"/></Link>
        )}



<DataTable value={Timologia} paginator 
showGridlines rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={[
                'id', 
                'ErgaName',
                'invoice_number', 
                'invoice_date',
                'ammount_no_tax',
                'ammount_tax_incl',
                'actual_payment_date',
                'ammount_of_income_tax_incl',
                'comments',
                'status_paid'

                ]} 
            header={header} 
            emptyMessage="No timologia found.">
                <Column field="id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                {/* <Column field="ErgaName"  header="Εργο"  filter filterPlaceholder="Search by Ergo" style={{ minWidth: '12rem' }}></Column> */}
                <Column header="Εργο" filterField="ErgaName" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={ergaBodyTemplate} filter filterElement={ergaFilterTemplate} />  
                
                <Column field="invoice_number"  header="Αρ. τιμολογίου"  filter filterPlaceholder="Search by invoice_number" style={{ minWidth: '12rem' }}></Column>
                <Column header="Ημερομηνία έκδοσης τιμολογίου" filterField="invoice_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={invoice_dateDateBodyTemplate} filter filterElement={invoice_dateDateFilterTemplate} ></Column>

                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}

                <Column header="Ποσό τιμολογίου  (καθαρή αξία)" filterField="ammount_no_tax" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_no_taxBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Ποσό ΦΠΑ" filterField="ammount_tax_incl" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_tax_inclBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="Ημερομηνία πληρωμής τιμολογίου (εκτίμηση)" filterField="actual_payment_date" dateFormat="dd/mm/yy" dataType="date" style={{ minWidth: '5rem' }} body={actual_payment_dateDateBodyTemplate} filter filterElement={actual_payment_dateDateFilterTemplate} ></Column>

                <Column header="Πληρωτέο" filterField="ammount_of_income_tax_incl" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_of_income_tax_inclBodyTemplate} filter filterElement={ammountFilterTemplate} />

                
            

            <Column field="comments" header="Σχόλια"  filter filterPlaceholder="Search by comment"  style={{ minWidth: '12rem' }}></Column>

            {/* <Column field="status_paid" header="status_paid"  filter filterPlaceholder="Search by status_paid"  style={{ minWidth: '12rem' }}></Column> */}

            <Column field="status_paid" header="Κατάσταση τιμολογίου" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '5rem' }} body={statusPaidBodyTemplate} filter filterElement={statusPaidFilterTemplate} />
        
               
                <Column header="Ενέργειες" field="id" body={actionsBodyTemplate} alignFrozen="right" frozen/>

 </DataTable>
       
    </div>




    //     <div style={{ overflowX: 'auto', maxWidth: '800px'}}>
    //     <div>
    //     <h1 className='title'>ΤΙΜΟΛΟΓΙΑ</h1>
    //     {user && user.role ==="admin" && (
    //     <Link to={"/timologia/add"} className='button is-primary mb-2'>Προσθήκη Νέου Τιμολογίου</Link>
    //     )}
    //     <div className="table-responsive-md">

    //     <table className='table is-stripped is-fullwidth'>
    //         <thead>
    //             <tr>

    //                 <th>#</th>

    //                 <th>ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</th>
    //                 <th>ΠΟΣΟ ΧΩΡΙΣ Φ.Π.Α</th>
    //                 <th>ΠΟΣΟ ΜΕ Φ.Π.Α</th>
    //                 <th>ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</th>
    //                 <th>ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α</th>
    //                 <th>ΠΑΡΑΤΗΡΗΣΕΙΣ</th>
    //                 <th>ΑΡΙΘΜΟΣ ΤΙΜΟΛΟΓΗΣΗΣ</th>
    //                 <th>Ενέργειες</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {Timologia.map((Timologia,index)=>(
    //                 <tr key={Timologia.id}>
    //                     <td>{index+1}</td>
    //                     <td>{Timologia.invoice_date}</td>
    //                     <td>{Timologia.ammount_no_tax}</td>
    //                     <td>{Timologia.ammount_tax_incl }</td>
    //                     <td>{Timologia.actual_payment_date }</td>
    //                     <td>{Timologia.ammount_of_income_tax_incl }</td>
    //                     <td>{Timologia.comments }</td>
    //                     <td>{Timologia.invoice_number}</td>


    //                     <td>
    //                         <Link to={`/timologia/profile/${Timologia.id}`} className='button is-small is-info'>Προφίλ</Link>
    //                         {user && user.role ==="admin" && (
    //                         <div>
    //                             <Link to={`/Timologia/edit/${Timologia.id}`} className='button is-small is-info'>Επεξεργασία</Link>
    //                             <button onClick={()=>deleteTimologio(Timologia.id)} className='button is-small is-danger'>Διαγραφή</button>
                                
    //                         </div>
    //                         )}
                            
    //                     </td>
    //                 </tr>
    //             ))}
                
    //         </tbody>
    //     </table>
    //     </div>
    // </div>
    // </div>
    )
}

export default TimologiaList