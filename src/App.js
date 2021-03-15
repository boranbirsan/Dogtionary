import './App.css';

import React from 'react';
import {Button, Grid, Modal, Typography} from '@material-ui/core';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import InfiniteScroll from 'react-infinite-scroller';

import Title from './assets/Dogtionary.png';

import Navbar from './components/navbar';

// Adds the WASM backend to the global backend registry.

const mobilenet = require('@tensorflow-models/mobilenet');


class App extends React.Component {
    state = {
        loading: false,
        images: [],
        displayImages: [],
        hasMore: false,
        selectedFile: null,
        imagePreviewUrl: null,
        classification: null,
        altMessage: null,
        altClassifications: [],
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
        fileSelected: false,
        breeds: {},
    }

    componentDidMount = async () => {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        await this.setState({breeds: data.message});
        console.log(data.message);
    }

    onFileChange = async event => {
        this.setState({loading: true});
        event.preventDefault();

        if (event.target.files[0]) {
            let reader = new FileReader();
            let file = event.target.files[0];

            reader.onloadend = () => {
                this.setState({
                    images: [],
                    displayImages: [],
                    hasMore: false,
                    classification: null,
                    selectedReaction: null,
                    altClassifications: [],
                    altMessage: null,
                    selectedFile: file,
                    imagePreviewUrl: reader.result,
                    error: null,
                    loading: false,
                    fileSelected: true,
                });
            }

            reader.readAsDataURL(file);
        } else {
            this.setState({
                images: [],
                displayImages: [],
                hasMore: false,
                classification: null,
                selectedReaction: null,
                altClassifications: [],
                altMessage: null,
                error: null,
                loading: false,
            })
        }
    }

    onFileUpload = async () => {
        this.setState({loading: true});

        if (this.state.selectedFile) {

            const model = await mobilenet.load();

            // Required for predictions @tensorflow-models/mobilenet only accepts HTMLImageElement type
            let element = document.createElement('img');
            element.src = this.state.imagePreviewUrl;

            const predictions = await model.classify(element);

            console.log(predictions);

            const max = predictions.reduce((prev, current) => {
                return (prev.probability > current.probability) ? prev : current;
            });

            var currentClasses = [];

            try {
                if (max.probability >= 0.60) {
                    const fullName = this.ParseName(max);
                    await this.DogRequest(fullName);
                } else {
                    for(let i = 0; i < predictions.length; i++){
                        currentClasses.push(this.ParseName(predictions[i]));
                    }

                    this.setState({
                        images: [],
                        displayImages: [],
                        hasMore: false,
                        classification: null,
                        selectedReaction: null,
                        altMessage: "Couldn't classify this breed, could it be one of the following:",
                        altClassifications: currentClasses,
                        loading: false,
                    });
                }
            }catch (e){
                if(currentClasses.length === 0) {
                    this.setState({error: e.message, loading: false});
                }else{
                    this.setState({
                        images: [],
                        displayImages: [],
                        hasMore: false,
                        classification: null,
                        selectedReaction: null,
                        altMessage: "Couldn't classify this breed, could it be one of the following:",
                        altClassifications: currentClasses,
                        loading: false,});
                }
            }
        } else {
            this.setState({
                error: 'You must upload an image for classification',
                loading: false,
            });
        }
    }

    DogRequest = async (fullName) => {
        let breedName;
        let subBreed;

        if (fullName.indexOf(' ') > -1) {
            breedName = fullName.split(' ')[1].toLowerCase();
            subBreed = '/' + fullName.split(' ')[0].toLowerCase();
        } else {
            breedName = fullName.toLowerCase();
            subBreed = '';
        }

        const response = await fetch('https://dog.ceo/api/breed/' + breedName + subBreed + '/images');
        const data = await response.json();
        if (response.ok) {
            const randomInt = Math.floor(Math.random() * Math.floor(this.state.reactions.length));
            const images = data.message;
            this.setState({
                images: images,
                displayImages: images.slice(0, 10),
                hasMore: true,
                classification: fullName,
                altMessage: null,
                altClassifications: [],
                selectedReaction: this.state.reactions[randomInt],
                error: null,
                loading: false,
            });
        } else {
            this.setState({
                error: "Looks like we don't have any images of this breed. Please try again with another image.",
                loading: false,
            });
        }
    }

    ParseName = (classification) => {
        const arr = [];
        Object.keys(this.state.breeds).forEach((key) => {
            arr.push(key);
        });

        // Specific breeds that are commonly 2 words, but written as 1 word in the API
        if (classification.className.toLowerCase().includes('german shepherd')) classification.className += ' germanshepherd';
        if (classification.className.toLowerCase().includes('mexican hairless')) classification.className += ' mexicanhairless';
        if (classification.className.toLowerCase().includes('coton de tulear')) classification.className += ' cotondetulear';
        if (classification.className.toLowerCase().includes('st bernard')) classification.className += ' stbernard';

        const names = classification.className.toLowerCase();

        for (let j = 0; j < arr.length; j++) {

            let breedName = arr[j];

            if (names.includes(breedName) && this.state.breeds[breedName].length === 0) {

                return breedName.charAt(0).toUpperCase() + breedName.slice(1);

            } else if (names.includes(breedName)) {

                for (let k = 0; k < this.state.breeds[breedName].length; k++) {
                    if (names.includes(this.state.breeds[breedName][k])) {
                        let subBreed = this.state.breeds[breedName][k];
                        return subBreed.charAt(0).toUpperCase() + subBreed.slice(1) + ' ' + breedName.charAt(0).toUpperCase() + breedName.slice(1);
                    }
                }

                return breedName.charAt(0).toUpperCase() + breedName.slice(1);
            }
        }
        throw new Error("I'm sorry, this is not a dog that I recognize, please try again with a different image.");
    }

    render() {
        return (
            <Navbar>
                <div className='root'>
                    <img className='Title' src={Title} alt={''}/>
                    <Typography style={{fontFamily: 'book antiqua', padding: '20px', fontSize: '20px'}}>
                        Upload a picture of a dog and our system will classify the breed, providing you with
                        more pictures of dogs of the same breed. Enjoy!
                    </Typography>
                    <Typography style={{padding: '20px', fontSize: '20px'}}><strong className='warning'>CATS
                        BEWARE!</strong></Typography>
                    <div className='upload'>
                        <input id="contained-button-file" type="file" accept=".png, .jpg, .jpeg"
                               onChange={this.onFileChange}/>
                        <label htmlFor="contained-button-file">
                            <Button size="small" variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                            {this.state.selectedFile ? '' + this.state.selectedFile.name : 'upload Dog image'}
                        </label>
                        <Button size="small" variant="contained" disabled={!this.state.fileSelected}
                                onClick={this.onFileUpload}>
                            submit
                        </Button>
                    </div>
                    <div>
                        {this.state.imagePreviewUrl &&
                        <img className='preview' src={this.state.imagePreviewUrl} alt={''}/>}
                    </div>
                </div>
                {this.state.altClassifications.length > 0 && <div>
                    <h3 className='classification'>{this.state.altMessage}</h3>
                    <Grid container
                          direction="row"
                          justify="space-evenly"
                          alignItems="flex-start"
                    >
                        {this.state.altClassifications.map((ele) => {
                            return (
                                <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                                    <Button size="small" variant="contained" color="primary"
                                            onClick={() => this.DogRequest(ele)}>{ele}</Button>
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>}
                {this.state.error && <h3 className='error'>{this.state.error}</h3>}
                {this.state.classification && <h3 className='classification'>
                    Enjoy our images of the {this.state.classification}s. {this.state.selectedReaction}
                </h3>}
                <InfiniteScroll
                    pageStart={0}
                    loadMore={(page) => {
                        this.setState({displayImages: this.state.images.slice(0, page * 10)});

                        this.setState({hasMore: this.state.displayImages.length < this.state.images.length});
                    }}
                    hasMore={this.state.hasMore}
                    loader={<div style={{textAlign: 'center'}} key={0}>Loading ...</div>}
                    useWindow={true}
                    initialLoad={false}
                    threshold={10}
                >
                    <ResponsiveMasonry columnsCountBreakPoints={{650: 1, 950: 2, 1250: 3, 1550: 4}}>
                        <Masonry>
                            {this.state.displayImages.map((value, index) => {
                                return (
                                    <div key={index} style={{minWidth: '300px'}}>
                                        <img loading='lazy' style={{width: '100%'}} src={value} alt={''}/>
                                    </div>
                                );
                            })}
                        </Masonry>
                    </ResponsiveMasonry>
                </InfiniteScroll>
                <Modal open={this.state.loading}>
                    <div className='loading'>
                        <p style={{fontSize: '50px', color: 'white'}}>Loading ...</p>
                    </div>
                </Modal>
            </Navbar>
        );
    }
}

export default App;
