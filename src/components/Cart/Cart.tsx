import * as _React  from 'react'; 
import { useState, useEffect } from 'react'; 
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
    Alert } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';

// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { ShopProps } from '../../customHooks';
import { shopStyles } from '../Shop';
import { serverCalls } from '../../api';
import { MessageType } from '../Auth'; 
import shopImage from '../../assets/images/production_id_4770380 (1080p).mp4'


const likedStyles = {
    main: {
        // backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${shopImage});`,
        height: '100%',
        width: '100%',
        color: 'grey',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px',
        // marginBottom: '-100vh'
    },

    card: {
        width: "300px", 
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.light,
        border: '2px solid',
        borderColor: theme.palette.primary.light,
        borderRadius: '10px',
        // transform: 'translate(-100%, -100%)'
        position: 'relative'
        // gridTemplateColumns: '1fr 1fr'
    },

    grid: {
        marginTop: '25px', 
        marginRight: 'auto', 
        marginLeft: 'auto', 
        width: '70vw',
        // marginBottom: '-100vh'
    }
}


export const Cart = () => {
//   setup our hooks
    const db = getDatabase();
    const [ open, setOpen ] = useState(false)
    const [ message, setMessage] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const [ currentCart, setCurrentCart ] = useState<ShopProps[]>()
    const userId = localStorage.getItem('uuid')
    const propRef = ref(db, `property/${userId}/`); 


    // useEffect to monitor changes to our cart in our database
    // takes in 2 arguments, 1st is function to run, 2nd is variable we are monitoring 
    useEffect(()=> {


        // onValue() is listening for changes in cart
        onValue(propRef, (snapshot) => {
            const data = snapshot.val() //grabbing our cart data from the database
            console.log(data)
            // whats coming back from the database is essentially a dictionary/object
            // we want our data to be a list of objects so we can forloop/map over them
            let propertyList = []

            if (data){
                for (let [key, value] of Object.entries(data)){
                    let propItem = value as ShopProps
                    propItem['id'] = key
                    propertyList.push(propItem)
                }
            }

            setCurrentCart(propertyList as ShopProps[])
        })

        // using the off to detach the listener (aka its basically refreshing the listener)
        return () => {
            off(propRef)
        }
    },[]);

    // Full CRUD capabilities for our Cart 
    // Update Cart
    // const updateQuantity = async (id: string, operation: string) => {

    //     // findIndex method to find the index of a value based on a conditional
    //     const dataIndex: number = currentCart?.findIndex((cart) => cart.id === id) as number//stores the index of the item it finds
    //     console.log(dataIndex)
    //     if (currentCart) console.log(currentCart[dataIndex as number])


    //     // make a new variable for our currentCart 
    //     const updatedCart = [...currentCart as ShopProps[]]
    //     console.log(updatedCart)
    //     if (operation == 'dec'){
    //         updatedCart[dataIndex].quantity -= 1 // quantity
    //     } else {
    //         updatedCart[dataIndex].quantity += 1 // quantity
    //     }

    //     setCurrentCart(updatedCart)
    // }

    // function to update cart items
    const updateCart = async ( cartItem: ShopProps ) => {

        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)


        // use the update() from our database to update a specific cart item
        update(itemRef, {
            quantity: cartItem.address // quantity
        })
        .then(() => {
            setMessage('Successfully Updated Your Cart')
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(() => window.location.reload(), 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }


    // function to delete items from our cart
    const deleteItem = async (propItem: ShopProps ) => {

        const itemRef = ref(db, `property/${userId}/${propItem.id}`)


        // use the update() from our database to update a specific cart item
        remove(itemRef)
        .then(() => {
            setMessage('Successfully Deleted Item from Cart')
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(() => window.location.reload(), 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }



    return (
        
        <Box >
            <NavBar />
            
            <Stack direction = 'column' sx={likedStyles.main} >
            <div style={{position:'fixed', zIndex:'-1'}}>
                <video autoPlay loop muted >
                    <source src={shopImage} type='video/mp4' />
                </video>
            </div>

                <Stack  alignItems = 'center' sx={{marginTop: '100px', marginLeft: '4vh'}}>
                
                    <Typography 
                        variant = 'h3'
                        sx = {{alignContent:'center'}}
                        fontWeight='bold'
                        
                    >
                        Your Liked Properties
                    </Typography>
                    {/* <Button color = 'primary' variant = 'contained' onClick={()=>{}} >Checkout 🎄</Button> */}
                </Stack>
                <Grid container spacing={3} sx={likedStyles.grid}>
                    {currentCart?.map((property: ShopProps, index: number) => (
                        <Grid item key={index} xs={12} md={6} lg={4}>
                            <Card sx={likedStyles.card}>
                                <CardMedia 
                                    component = 'img'
                                    sx = {shopStyles.cardMedia}
                                    image = {property.imgSrc}
                                    alt = {property.address}
                                />
                                <CardContent>
                                    <Stack direction = 'column' justifyContent='space-between' alignItems = 'center'>
                                        <Accordion sx = {{color: 'white', backgroundColor: theme.palette.secondary.light}}>
                                            <AccordionSummary 
                                                expandIcon={<InfoIcon sx={{color: theme.palette.primary.main}}/>}
                                            >
                                            <div style={{display:'flex', flexDirection:'column', margin: '0 auto', width:'200px'}}>
                                                <Typography>{property.address}</Typography>
                                                <Typography>Bathrooms: {property.bathrooms}</Typography>
                                                <Typography>Bedrooms: {property.bedrooms}</Typography>
                                                <Typography>Living Area: {property.livingArea}sqft</Typography>
                                                <Typography>Property Type: {property.propertyType}</Typography>
                                                <Typography>Zestimate: ${property.zestimate}</Typography>
                                            </div>
                                
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>{property.price}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Stack 
                                            direction = 'row' 
                                            alignItems = 'center' 
                                            justifyContent='space-between' 
                                            sx={shopStyles.stack2}
                                        >
                                            {/* <Button 
                                                size='large'
                                                variant='text'
                                                onClick={()=>{updateQuantity(cart.id, 'dec')}}
                                            >-</Button> */}
                                            {/* <Typography variant = 'h6' sx={{color: 'white'}}>
                                                {cart.quantity}
                                            </Typography>
                                            <Button 
                                                size='large'
                                                variant='text'
                                                onClick={()=>{updateQuantity(cart.id, 'inc')}}
                                            >+</Button> */}
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
                                            size = 'medium'
                                            variant = 'contained'
                                            sx = {shopStyles.button}
                                            onClick = {()=>{deleteItem(property)}}
                                        >
                                            Remove This Property
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>

                        </Grid>
                    ))}
                    
                </Grid>
            
            </Stack>
            
        </Box>
        
    )
}

