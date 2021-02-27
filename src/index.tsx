import ReactDOM from 'react-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

import './styles/style.scss';

import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
