import './App.css';

import React from 'react';

import {Modal, CircularProgress, Button} from '@material-ui/core';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import InfiniteScroll from 'react-infinite-scroller';

import Title from './assets/Dogtionary.png'

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
                    selectedFile: file,
                    imagePreviewUrl: reader.result,
                    error: null,
                    loading: false,
                    fileSelected: true,
                });
            }

            reader.readAsDataURL(file);
        }else {
            this.setState({
                images: [],
                classification: null,
                selectedReaction: null,
                error: null,
                loading: false
            })
        }
    }

    onFileUpload = async () => {
        this.setState({loading: true});

        if(this.state.selectedFile) {

            const model = await mobilenet.load();

            // Required for predictions @tensorflow-models/mobilenet only accepts HTMLImageElement type
            let element = document.createElement('img');
            element.src = this.state.imagePreviewUrl;

            const predictions = await model.classify(element);

            console.log(predictions);

            const max = predictions.reduce((prev, current) => {
                return (prev.probability > current.probability) ? prev : current;
            });

            var breedName;
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

            if (max.probability >= 0.60) {

                if(subBreed !== ''){
                    const response = await fetch('https://dog.ceo/api/breed/' + breedName + '/' + subBreed + '/images');
                    const data = await response.json();
                    if(response.ok){
                        const randomInt = Math.floor(Math.random() * Math.floor(this.state.reactions.length));
                        const images = data.message;
                        this.setState({
                            images: images,
                            displayImages: images.slice(0, 10),
                            hasMore: true,
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
                        const images = data.message;
                        this.setState({
                            images: images,
                            displayImages: images.slice(0, 10),
                            hasMore: true,
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
                    error: 'Accuracy of predictions are too low, please try a different image',
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
                <div className='root'>
                    <img className='Title' src={Title} alt={''}/>
                    <p style={{fontFamily: 'book antiqua'}}>
                        Upload a picture of a dog and our system will classify the breed, providing you with
                        more pictures of dogs of the same breed. Enjoy!
                    </p>
                    <strong className='warning'>CATS BEWARE</strong>
                    <div className='upload'>
                        <input id="contained-button-file" type="file" accept=".png, .jpg, .jpeg" onChange={this.onFileChange} />
                        <label htmlFor="contained-button-file">
                            <Button size="small" variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                            {this.state.selectedFile ? ''+this.state.selectedFile.name : 'upload Dog image'}
                        </label>
                        <Button size="small" variant="contained" disabled={!this.state.fileSelected} onClick={this.onFileUpload}>
                            submit
                        </Button>
                    </div>
                    <div>
                        {this.state.imagePreviewUrl && <img className='preview' src={this.state.imagePreviewUrl} alt={''}/>}
                    </div>
                </div>
                {this.state.error && <h3 className='error'>
                    {this.state.error}
                </h3>}
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
                <Modal open={this.state.loading} >
                    <div className='loading'>
                        <p style={{color: 'white'}}>loading ...</p>
                    </div>
                </Modal>
            </Navbar>
        );
    }
}

export default App;
