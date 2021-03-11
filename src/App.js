import './App.css';

import React from 'react';

import {Grid, Backdrop, CircularProgress} from '@material-ui/core';

import Navbar from './components/navbar';
const mobilenet = require('@tensorflow-models/mobilenet');

class App extends React.Component {
    state = {
        loading: false,
        images: [],
        selectedFile: null,
        imagePreviewUrl: null,
        classification: null,
        reactions: [
            'How cute.',
            'Precious.',
            'Aaawwwwwww.',
            'Too cuuuute.',
            'I want one too.',
            'Look how cute they are.',
            'So sweet.',
            'The cutiepies :)',
        ],
        selectedReaction: null,
        error: null,
    }

    onFileChange = async event => {
        this.setState({loading: true});
        event.preventDefault();

        let reader = new FileReader();
        let file = event.target.files[0];

        reader.onloadend = () => {
            this.setState({
                selectedFile: file,
                imagePreviewUrl: reader.result,
                error: null,
                loading: false,
            });
        }

        reader.readAsDataURL(file);
    };

    onFileUpload = async () => {
        this.setState({loading: true});
        if(this.state.selectedFile) {
            const model = await mobilenet.load();

            let element = document.createElement('img');
            element.src = this.state.imagePreviewUrl;

            const predictions = await model.classify(element);

            const max = predictions.reduce((prev, current) => {
                return (prev.probability > current.probability) ? prev : current;
            });

            var breedName = '';
            var subBreed = '';

            if (max.className.indexOf(',') > -1) {
                breedName = max.className.split(',')[0].toLowerCase();
                if(breedName.indexOf(' ') > -1) {
                    subBreed = breedName.split(' ')[0].toLowerCase();
                    breedName = breedName.split(' ')[1].toLowerCase();
                }
            }else if(max.className.indexOf(' ') > -1){
                subBreed = max.className.split(' ')[0].toLowerCase();
                breedName = max.className.split(' ')[1].toLowerCase();
            }else{
                breedName = max.className.toLowerCase();
            }

            if (max.probability >= 0.80) {
                if(subBreed !== ''){
                    const response = await fetch('https://dog.ceo/api/breed/' + breedName + '/' + subBreed + '/images');
                    const data = await response.json();
                    if(response.ok){
                        const randomInt = Math.floor(Math.random() * Math.floor(this.state.reactions.length));
                        this.setState({
                            images: data.message,
                            classification: subBreed + ' ' + breedName,
                            selectedReaction: this.state.reactions[randomInt],
                            error: null,
                            loading: false,
                        });
                    }else{
                        this.setState({
                            error: 'Could not find the correctly find the images of this breed. It might help to try another picture or breed.',
                            loading: false,
                        });
                    }
                }else {
                    const response = await fetch('https://dog.ceo/api/breed/' + breedName + '/images');
                    const data = await response.json();
                    if(response.ok) {
                        const randomInt = Math.floor(Math.random() * Math.floor(this.state.reactions.length));
                        this.setState({
                            images: data.message,
                            classification: breedName,
                            selectedReaction: this.state.reactions[randomInt],
                            error: null,
                            loading: false,
                        });
                    }else{
                        this.setState({
                            error: 'Could not find the correctly find the images of this breed. It might help to try another picture or breed.',
                            loading: false,
                        });
                    }
                }
            } else {
                this.setState({
                    error: 'Could not accurately classify a breed',
                    loading: false,
                });
            }
        }else {
            this.setState({
                error: 'You must upload an image for classification',
                loading: false,
            });
        }
    }

    render(){
        return (
            <Navbar>
                <div style={{textAlign: 'center'}}>
                    <h1>Dogtionary</h1>
                    <p>Upload a picture of a dog and our system will classify the breed of the dog. providing your with
                        more pictures of dogs of the same breed. Please enjoy.
                    </p>
                    <strong style={{display: 'block', paddingBottom: '15px'}}>CATS BEWARE</strong>
                    <div>
                        <input type="file" accept=".png, .jpg, .jpeg"  onChange={this.onFileChange} />
                        <button onClick={this.onFileUpload}>
                            Upload!
                        </button>
                    </div>
                    <div>
                        {this.state.imagePreviewUrl && <img style={{padding: '7px', maxWidth: '300px'}} src={this.state.imagePreviewUrl} alt={''}/>}
                    </div>
                </div>
                {this.state.error && <h3 style={{display: 'block', padding: '15px', textAlign: 'center', color: 'red'}}>
                    {this.state.error}
                </h3>}
                {this.state.classification && <h3 style={{display: 'block', padding: '15px', textAlign: 'center'}}>
                    Enjoy our images of the {this.state.classification}s. {this.state.selectedReaction}
                </h3>}
                <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    spacing={1}
                >
                    {this.state.images.map((value, index) => {
                        return (
                            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                <div>
                                    <img style={{width: '100%'}} src={value} alt={''}/>
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
                <Backdrop open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Navbar>
        );
    }
}

export default App;
