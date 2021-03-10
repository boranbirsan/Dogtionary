import './App.css';

import React from 'react';

import {Grid} from '@material-ui/core'

import Navbar from './components/navbar';

class App extends React.Component {
    state = {
        loading: true,
        images: [],
        selectedFile: null,
        imagePreviewUrl: null,
    }

    onFileChange = event => {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];

        reader.onloadend = () => {
            this.setState({
                SelectedFile: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file);
    };

    onFileUpload = async () => {
        const response = await fetch('https://dog.ceo/api/breed/beagle/images');
        const data = await response.json();
        this.setState({images: data.message});
    }

    render(){
        return (
            <Navbar>
                <div className='App'>
                    <h1>Dogtionary</h1>
                    <div>
                        <input type="file" accept=".png, .jpg, .jpeg"  onChange={this.onFileChange} />
                        <button onClick={this.onFileUpload}>
                            Upload!
                        </button>
                    </div>
                    <div>
                        {this.state.imagePreviewUrl && <img className='preview' src={this.state.imagePreviewUrl} />}
                    </div>
                </div>
                <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    spacing={1}
                >
                    {this.state.images.map((value, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <div>
                                    <img className='photo' src={value} />
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
                {/*<img src={logo} className="App-logo" alt="logo" />*/}
            </Navbar>
        );
    }
}

export default App;
