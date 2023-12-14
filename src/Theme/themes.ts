import { createTheme } from'@mui/material'; 


export const theme = createTheme({
    typography: {
        fontFamily: 'Avenir, system-ui, Inter, Helvetica, Arial, sans-serif'
    },
    palette: {
        primary: {
            main: '#0a4a77'
        },
        secondary: {
            main: '#242625',
            light: '#1B2929'
        },
        info: {
            main: '#79b2ca'
        }
    }
})