/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
'Cedar'
#a3291d
rgb(163, 41, 29)

'Black'
#2b2e34
rgb(43, 46, 52)

'Grey'
#59584c
rgb(89, 88, 76)
*/
import typography from './FirstVoicesTypography'
export default {
  typography,
  palette: {
    primary: {
      contrastText: '#ffffff',
      dark: '#7d0000',
      light: '#ee492d',
      main: '#a3291d',
    },
    secondary: {
      main: '#2b2e34',
    },
    primary1Color: '#b40000',
    primary2Color: '#3a6880',
    accent4Color: '#e1e1e2',
  },
  appBarIcon: {
    color: '#fff',
  },
  appBar: {
    color: '#fff',
    backgroundColor: '#b40000',
    'a&:hover': {
      color: '#000',
    },
  },
  localePicker: {
    color: '#fff',
    backgroundColor: '#ab0000',
  },
  dialectContainer: {
    color: '#fff',
    backgroundColor: '#3a6880',
    '&:visited': {
      color: '#fff',
    },
  },
  button: {
    containedPrimary: {
      color: '#fff',
      backgroundColor: '#b40000',
      '&:hover': {
        color: '#fff',
        backgroundColor: '#d57470',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: '#d57470',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        backgroundColor: '#e5e5e5',
      },
    },
    containedSecondary: {
      color: 'blue',
      backgroundColor: 'yellow',
      '&:hover': {
        color: 'yellow',
        backgroundColor: 'blue',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'pink',
        },
      },
      '&$disabled': {
        color: '#a1a1a1',
        backgroundColor: '#e5e5e5',
      },
    },
  },
}
