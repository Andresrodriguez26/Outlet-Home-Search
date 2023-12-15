import * as _React from 'react'; 
// import React from 'react'; 
import { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    TextField,
    Alert } from '@mui/material'; 
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';   
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Grid from "@mui/material/Grid";
import InfoIcon from '@mui/icons-material/Info';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, push } from 'firebase/database'




// internal imports
import { useGetShop, ShopProps } from '../../customHooks';
import { NavBar, InputText } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { MessageType } from '../Auth';
import { serverCalls } from '../../api';
import { display, flexbox } from '@mui/system';
import shopImage from '../../assets/images/nona-orlando.jpeg'; 



// creating our Shop CSS style object 
export const shopStyles = {
    main: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${shopImage});`,
        height: '100%',
        width: '100%',
        color: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px', 
        marginRight: 'auto', 
        marginLeft: 'auto', 
        width: '70vw'
    },
    card: {
        width: "550px", 
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.light,
        border: '2px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px',
        // gridTemplateColumns: '1fr 1fr'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '1/1',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'white', 
        borderRadius: '30px',
        height: '50px',
        width: '250px',
        marginTop: '15px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid', 
        borderColor: theme.palette.primary.main, 
        borderRadius: '50px', 
        width: '100%',
        marginTop: '10px'
    },
    typography: { 
        marginLeft: '0', 
        color: "white", 
        marginTop: '100px',
        marginBottom: '20px',
        fontWeight: 'bold'
    }

}


export interface SubmitProps {
    location: string,
    status_type: string,
    home_type: string,
    minPrice: string,
    maxPrice: string,
    bathsMax: string,
    bedsMax: string
}

   


interface CartProps {
    cartItem: ShopProps
}


// const AddToCart = (cart: CartProps ) => {
//     // setup our hooks & variables
//     const db = getDatabase();
//     const [ open, setOpen ] = useState(false)
//     const [ message, setMessage] = useState<string>()
//     const [ messageType, setMessageType ] = useState<MessageType>()
//     const { register, handleSubmit } = useForm<SubmitProps>({})

//     let myCart = cart.cartItem //this is grabbing our data object to send to the database for our cart 

//     const onSubmit: SubmitHandler<SubmitProps> = async (data: SubmitProps, event: any) => {
//         if (event) event.preventDefault(); 

//         // const userId = localStorage.getItem('uuid') //grabbing the user id from localstorage 
//         // const cartRef = ref(db, `carts/${userId}/`) // this is where we are pathing in our database 

        


//         // if they try to add a quantity greater than available it'll just go down to available quantity 

//         // if (myCart.quantity > parseInt(data.quantity)) {
//         //     myCart.quantity = parseInt(data.quantity)
//         // }

//         // push because we are pushing an object to a list essentially
//         // takes in two arguments, 1st is where we are pushing, 2nd is what we are pushing
//         push(cartRef, myCart)
//         .then((_newCartRef) => {
//             setMessage(`Successfully added item ${myCart.address} to Cart`)
//             setMessageType('success')
//             setOpen(true)
//         })
//         .then(() => {
//             setTimeout(()=>{window.location.reload()}, 2000)
//         })
//         .catch((error) => {
//             setMessage(error.message)
//             setMessageType('error')
//             setOpen(true)
//         })
//     }

//     return (
//         <Box>
//             <Snackbar
//                 open={open}
//                 autoHideDuration={3000}
//                 onClose={()=> setOpen(false)}
//             >
//                 <Alert severity = {messageType}>
//                     {message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     )
// }


export const Shop = () => {
    // setup our hooks
    // const { shopData } = useGetShop(); //list of all our data objects 
    const [shopData, setShopData] = useState<[]>([])
    const [ currentShop, setCurrentShop] = useState<ShopProps>(); //one and only one object we will send to our cart 
    const [ cartOpen, setCartOpen ] = useState(false); 
    const { register, handleSubmit } = useForm<SubmitProps>({})
    const [ message, setMessage] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const [ open, setOpen ] = useState(false)

    const onSubmit: SubmitHandler<SubmitProps> = async (data: SubmitProps, event: any) => {
        if (event) event.preventDefault(); 
        let apicall = await serverCalls.getProperty(data) 
        setShopData(apicall)
    }

    const db = getDatabase();

    const userId = localStorage.getItem('uuid') //grabbing the user id from localstorage 
    const propRef = ref(db, `property/${userId}/`) // this is where we are pathing in our database 

      
    const addToList = (shop: ShopProps) => {
        console.log(currentShop)
        push(propRef, shop)
        .then((_newCartRef) => {
            console.log('Success')
            setMessage(`Successfully added house ${shop.address} to your liked properties`)
            setMessageType('success')
            setOpen(true)
        })
        // .then(() => {
        //     setTimeout(()=>{window.location.reload()}, 2000)
        // })
        .catch((error) => {
            console.log(error.message)
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }
    

    console.log(shopData)
    return (
        <Box sx={ shopStyles.main }>
            <NavBar />
            <Typography 
                variant = 'h2'
                sx = { shopStyles.typography }
                textAlign='center'
                >
                Welcome To Outlet 
            </Typography>  
            {/* added bottom part */}


            <form onSubmit={handleSubmit(onSubmit)} >
                <div style={{display:'flex', flexDirection:'column', width:'800px', margin:'50px auto', border:'solid white', padding:'5vh', backgroundColor: 'grey', borderRadius:'5px'}}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'25px'}}>
                        <div>
                    <label htmlFor='location'>What is the zip-code you are interested in ?</label>
                    <InputText {...register('location')} name='location' placeholder='Zip-Code Here' />
                        </div>
                        <div>
                    <label htmlFor='status_type'>Please type in ForSale or ForRent </label>
                    <InputText {...register('status_type')} name='status_type' placeholder='Status' />
                        </div>
                        <div>
                    <label htmlFor='home_type'>Home Type </label>
                    <InputText {...register('home_type')} name='home_type' placeholder='Home Type Here' />
                        </div>
                        <div>
                    <label htmlFor='minPrice'>What is the Minimun Price? </label>
                    <InputText {...register('minPrice')} name='minPrice' placeholder='Min Price' />
                        </div>
                        <div>
                    <label htmlFor='maxPrice'>What is the Maximum Price? </label>
                    <InputText {...register('maxPrice')} name='maxPrice' placeholder='Max Price' />
                        </div>
                        <div>
                    <label htmlFor='bathsMax'>Baths Max?  </label>
                    <InputText {...register('bathsMax')} name='bathsMax' placeholder='Baths Max' />
                        </div>
                        <div>
                    <label htmlFor='bedsMax'>Beds Max? </label>
                    <InputText {...register('bedsMax')} name='bedsMax' placeholder='Beds Max' />
                    </div>
                    </div>
                    <div style={{display:'flex', flexDirection:'column', width:'120px', margin:'0px auto' }}>
                    <Button variant="contained" type='submit' >Search</Button>
                    </div>
                </div>
                
            </form>
            <div style= {{display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '0px auto', width: '100%', justifyItems:'center', gap: '50px'}}>
                { shopData ? (shopData.map((shop: ShopProps, index: number ) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                        <Card sx={shopStyles.card}>
                            <CardMedia 
                                component='img'
                                sx={shopStyles.cardMedia}
                                image={shop.imgSrc}
                                alt={shop.address}
                            />
                            <CardContent>
                                <Stack 
                                    direction='column'
                                    justifyContent='space-between'
                                    alignItems = 'center'
                                    
                                >
                                    <Stack 

                                        direction = 'row'
                                        alignItems = 'center'
                                        justifyContent = 'space-between'
                                    >
                                        <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                            <AccordionSummary 
                                                expandIcon={<InfoIcon sx={{ color: theme.palette.primary.main }}/>}
                                            >
                                            <div style={{display:'flex', flexDirection:'column', margin: '0 auto', width:'400px'}}>
                                                <Typography>{shop.address}</Typography>
                                                <Typography>Bathrooms: {shop.bathrooms}</Typography>
                                                <Typography>Bedrooms: {shop.bedrooms}</Typography>
                                                <Typography>Living Area: {shop.livingArea}sqft</Typography>
                                                <Typography>Property Type: {shop.propertyType}</Typography>
                                                <Typography>Zestimate: ${shop.zestimate}</Typography>
                                            </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>{shop.price}</Typography>
                                                {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBUAz5_HZAIisjH2BP5h9WBhydbHSh_0zs &libraries=places"></script> */}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                    <Snackbar
                                        open = {open}
                                        autoHideDuration={2000}
                                        onClose = { () => setOpen(false) }
                                    >
                                        <Alert severity = {messageType}>
                                            {message}
                                        </Alert>
                                    </Snackbar>
                                <Button
                                    size='medium'
                                    variant='outlined'
                                    sx={shopStyles.button}
                                    onClick = {()=>{addToList(shop)}}
                                >
                                    Save This Property  ${parseFloat(shop.price).toFixed(2)}
                                </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))):""}
            </div>
            {/* <Dialog open={cartOpen} onClose={()=>{setCartOpen(false)}}>
                <DialogContent>
                    <DialogContentText>Add to Cart</DialogContentText>
                    <AddToCart cartItem = {currentShop as ShopProps}/>
                </DialogContent>
            </Dialog> */}
        </Box>
    )
}


// async function initMap(): Promise<void> {
//   const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
//   map = new Map(document.getElementById("map") as HTMLElement, {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }

// initMap();

// let map: google.maps.Map;

