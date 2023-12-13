// let accessToken = ""
let userId = localStorage.getItem('uuid') //grabbing the uuid from Google Authentication 
import axios from 'axios';



// putting all our API calls in a giant dictionary/object

export const serverCalls = {

    getProperty: async (search_: any) => {

        const options = {
            method: 'GET',
            url: 'https://zillow69.p.rapidapi.com/search',
            params: search_,
            headers: {
              'X-RapidAPI-Key': '5ff0a59abemsh1a7801ed3d86869p10af1bjsn0d5785b8ed5a',
              'X-RapidAPI-Host': 'zillow69.p.rapidapi.com'
            }
          };
          
          try {
              const response = await axios.request(options);
              console.log(response.data);
              return response.data.props 
          } catch (error) {
              console.error(error);
          }
        
        }
    }


// console.log(serverCalls.getProperty())



//         const options = {
//             method: 'GET',
//             url: 'https://zillow-base1.p.rapidapi.com/WebAPIs/zillow/search',
//             params: {
//               location: '32827',
//               page: '1',
//               status_type: 'ForSale',
//               sort_by: 'Homes_For_You'
//             },
//             headers: {
//               'X-RapidAPI-Key': '5ff0a59abemsh1a7801ed3d86869p10af1bjsn0d5785b8ed5a',
//               'X-RapidAPI-Host': 'zillow-base1.p.rapidapi.com'
//             }
//           };
          
//           try {
//               const response = await axios.request(options);
//               console.log(response.data);
//               return response.data
//           } catch (error) {
//               console.error(error);
//           }

          

//     }
// }

// console.log(serverCalls.getProperty())

//         const options = {
//             method: 'POST',
//             url: 'https://realtor.p.rapidapi.com/properties/v3/list',
//             headers: {
//               'content-type': 'application/json',
//               'X-RapidAPI-Key': '5ff0a59abemsh1a7801ed3d86869p10af1bjsn0d5785b8ed5a',
//               'X-RapidAPI-Host': 'realtor.p.rapidapi.com'
//             },
//             data: {
//               limit: 10,
//               offset: 0,
//               postal_code: '32827',
//               status: ['for_sale'],
//               sort: {
//                 direction: 'desc',
//                 field: 'list_date'
//               }
//             }
//           };
          
//           try {
//               const response = await axios.request(options);
//               console.log(response.data);
//               return response.data
//           } catch (error) {
//               console.error(error);
//           }

//     }
// }