import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { Provider, useSelector } from 'react-redux';
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

const YpoxreoseisList = () =>
{
    const [ypoxreoseis, setYpoxreoseis] = useState([]);

    const [providers, setProvider]=useState([]);

    const {user} = useSelector((state)=>state.auth)

    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(()=>{
        getYpoxreoseis();
        setLoading(false);

        initFilters();

    },[]);

    const getYpoxreoseis = async() =>{
        // const response = await axios.get(`${apiBaseUrl}/ypoquery`, {timeout: 5000});
        // setYpoxreoseis(response.data);

        try {
            const response = await axios.get(`${apiBaseUrl}/ypoquery`, {timeout: 5000});
            const paraData = response.data;
            console.log("ParaData:",paraData);


            const uniqueProviders= [...new Set(paraData.map(item => item.ypoxreoseis?.provider || 'N/A'))];
            setProvider(uniqueProviders);
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
                'ypoxreoseis.invoice_date': new Date(item.ypoxreoseis?.invoice_date),
                'ypoxreoseis.total_owed_ammount': parseFloat(item.ypoxreoseis.total_owed_ammount),
                'ypoxreoseis.ammount_vat': parseFloat(item.ypoxreoseis.ammount_vat)
                // actual_payment_date: new Date(item.actual_payment_date)
            }));
            // Sort parDataWithDates by ypoxreoseis.invoice_date in ascending order
            const sortedParData = parDataWithDates.sort((a, b) => {
                const dateA = a['ypoxreoseis.invoice_date'];
                const dateB = b['ypoxreoseis.invoice_date'];
                return dateA - dateB; // Sort in ascending order
            });

            
    
            console.log(sortedParData); // Optionally log the transformed data
    
            // Assuming you have a state setter like setErga defined somewhere
            setYpoxreoseis(sortedParData);
    
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle errors as needed
        }



    }

    const deleteYpoxreoseis = async(YpoxreoseisId)=>{
        await axios.delete(`${apiBaseUrl}/ypoquery/${YpoxreoseisId}`);
        getYpoxreoseis();
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
            
            'ypoxreoseis.erga_id': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

            'ypoxreoseis.provider':  { value: null, matchMode: FilterMatchMode.IN },
            
            'ypoxreoseis.invoice_date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },

            'ypoxreoseis.total_owed_ammount': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            
            'ypoxreoseis.ammount_vat': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },

          

        });
        setGlobalFilterValue('');
    };



    const formatDate = (value) => {
        let date = new Date(value);
        let epochDate = new Date('1970-01-01T00:00:00Z');
        if (date.getTime() === epochDate.getTime()) 
        {
            return null;
        }
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
    return formatDate(rowData.ypoxreoseis.invoice_date);
};

const invoice_dateDateFilterTemplate = (options) => {
    console.log('Current filter value:', options);

    return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
};


    const total_owed_ammountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ypoxreoseis.total_owed_ammount);
    };

    const ammount_vatBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ypoxreoseis.ammount_vat);
    };

  

    const ammountFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="EUR" locale="en-US" />;
    };



    const providersBodyTemplate = (rowData) => {
        
        const provider = rowData.ypoxreoseis?.provider || 'N/A';        // console.log("repsBodytempl",timologio)
        console.log("timologio",provider," type ",typeof(provider));
        console.log("rep body template: ",provider)
    
        return (
            <div className="flex align-items-center gap-2">
                {/* <img alt={representative} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" /> */}
                <span>{provider}</span>
            </div>
        );
    };
    
    const providersFilterTemplate = (options) => {
        console.log('Current timologia filter value:', options.value);
    
            return (<MultiSelect value={options.value} options={providers} itemTemplate={providersItemTemplate} onChange={(e) => options.filterCallback(e.value)} placeholder="Any" className="p-column-filter" />);
    
        };
    
    
    const providersItemTemplate = (option) => {
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



    const formatCurrency = (value) => {
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };




    const footer = `In total there are ${ypoxreoseis ? ypoxreoseis.length : 0} ypoxrewseis.`;






    const header = renderHeader();


    const actionsBodyTemplate=(rowData)=>{
        const id=rowData.ypoxreoseis?.id
        return(
            <div className=" flex flex-wrap justify-content-center gap-3">
               
            {user && user.role!=="admin" &&(
                <div>
                    <Link to={`/ypoquery/profile/${id}`} ><Button severity="info" label="Προφίλ" text raised /></Link>
                </div>
            )}
            {user && user.role ==="admin" && (
            <span className='flex gap-1'>
                <Link to={`/ypoquery/profile/${id}`} ><Button icon="pi pi-eye" severity="info" aria-label="User" />
                </Link>
                <Link to={`/ypoquery/edit/${id}`}><Button icon="pi pi-pen-to-square" severity="info" aria-label="Εdit" /></Link>
                <Button icon="pi pi-trash" severity="danger" aria-label="Εdit"onClick={()=>deleteYpoxreoseis(id)} />
                {/* <Button label="Διαγραφή" severity="danger" onClick={()=>deleteParadotea(id)} text raised /> */}
            </span>
           
            )}
            </div>
 
        );
    }



    return(



        
<div className="card" >
        <h1 className='title'>Υποχρέωσεις</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ypoquery/add"} className='button is-primary mb-2'><Button label="Προσθήκη Νέας Υποχρέωσης" icon="pi pi-plus-circle"/></Link>
        )}



<DataTable value={ypoxreoseis} paginator stripedRows
showGridlines rows={20} scrollable scrollHeight="600px" loading={loading} dataKey="id" 
            filters={filters} 
            globalFilterFields={[
                'ypoxreoseis.id', 
                'ypoxreoseis.provider', 
                'ypoxreoseis.erga_id',
                'ypoxreoseis.invoice_date',
                'ypoxreoseis.total_owed_ammount',
                'ypoxreoseis.ammount_vat',
             

                ]} 
            header={header} 
            emptyMessage="No timologia found.">
                <Column field="ypoxreoseis.id" header="id" sortable style={{ minWidth: '2rem' }} ></Column>
                <Column header="Προμηθευτής-έξοδο" filterField="ypoxreoseis.provider" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={providersBodyTemplate} filter filterElement={providersFilterTemplate} />
                <Column field="ypoxreoseis.erga_id"  header="erga_id"  filter filterPlaceholder="Search by erga_id" style={{ minWidth: '12rem' }}></Column>
               
               
               
                <Column header="Ημερομηνία τιμολογίου" filterField="ypoxreoseis.invoice_date" dataType="date" style={{ minWidth: '5rem' }} body={invoice_dateDateBodyTemplate} filter filterElement={invoice_dateDateFilterTemplate} ></Column>

                {/* <Column field="ammount" header="ammount"  style={{ minWidth: '12rem' }} body={priceBodyTemplate}></Column> */}

                <Column header="Ποσό (σύνολο)" filterField="ypoxreoseis.total_owed_ammount" dataType="numeric" style={{ minWidth: '5rem' }} body={total_owed_ammountBodyTemplate} filter filterElement={ammountFilterTemplate} />
                <Column header="ΦΠΑ" filterField="ypoxreoseis.ammount_vat" dataType="numeric" style={{ minWidth: '5rem' }} body={ammount_vatBodyTemplate} filter filterElement={ammountFilterTemplate} />

        
               
                <Column header="Ενέργειες" field="id" body={actionsBodyTemplate} alignFrozen="right" frozen/>

 </DataTable>
       
    </div>

    //     <div style={{ overflowX: 'auto', maxWidth: '800px'}}>
    //     <div>
    //     <h1 className='title'>ΥΠΟΧΡΕΩΣΕΙΣ</h1>
    //     {user && user.role ==="admin" && (
    //     <Link to={"/ypoquery/add"} className='button is-primary mb-2'>Προσθήκη Νέας Υποχρέωσεις</Link>
    //     )}
    //     <div className="table-responsive-md">

    //     <table className='table is-stripped is-fullwidth'>
    //         <thead>
    //             <tr>

    //                 <th>#</th>

    //                 <th>ΠΑΡΟΧΟΣ</th>
    //                 <th>ΕΡΓΟ ΥΠΟΧΡΕΩΣΗΣ ID</th>
    //                 <th>ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</th>
    //                 <th>ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΟΦΕΛΗΣ</th>
    //                 <th>ΠΟΣΟ ΦΠΑ</th>
    //                 <th>TAGS</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {ypoxreoseis.map((ypoxreosh,index)=>(
    //                 <tr key={ypoxreosh.ypoxreoseis.id}>
    //                     <td>{index+1}</td>
    //                     <td>{ypoxreosh.ypoxreoseis.provider}</td>
    //                     <td>{ypoxreosh.ypoxreoseis.erga_id}</td>
    //                     <td>{ypoxreosh.ypoxreoseis.invoice_date}</td>
    //                     <td>{ypoxreosh.ypoxreoseis.total_owed_ammount}</td>
    //                     <td>{ypoxreosh.ypoxreoseis.ammount_vat}</td>
    //                     <td>{ypoxreosh.tags.join(' ')}</td>


    //                     <td>
    //                         <Link to={`/ypoquery/profile/${ypoxreosh.ypoxreoseis.id}`} className='button is-small is-info'>Προφίλ</Link>
    //                         {user && user.role ==="admin" && (
    //                         <div>
    //                             <Link to={`/ypoquery/edit/${ypoxreosh.ypoxreoseis.id}`} className='button is-small is-info'>Επεξεργασία</Link>
    //                             <button onClick={()=>deleteYpoxreoseis(ypoxreosh.ypoxreoseis.id)} className='button is-small is-danger'>Διαγραφή</button>
                                
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

export default YpoxreoseisList