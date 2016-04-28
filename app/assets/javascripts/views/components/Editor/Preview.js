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
import React, {Component, PropTypes} from 'react';
import provide from 'react-redux-provide';
import selectn from 'selectn';

import CircularProgress from 'material-ui/lib/circular-progress';
import Paper from 'material-ui/lib/paper';

@provide
export default class Preview extends Component {

  static propTypes = {
    fetchWord: PropTypes.func.isRequired,
    computeWord: PropTypes.object.isRequired,
    fetchPhrase: PropTypes.func.isRequired,
    computePhrase: PropTypes.object.isRequired,
    fetchCategory: PropTypes.func.isRequired,
    computeCategory: PropTypes.object.isRequired,
    fetchPicture: PropTypes.func.isRequired,
    computePicture: PropTypes.object.isRequired,
    fetchAudio: PropTypes.func.isRequired,
    computeAudio: PropTypes.object.isRequired,
    fetchVideo: PropTypes.func.isRequired,
    computeVideo: PropTypes.object.isRequired,
    fetchContributor: PropTypes.func.isRequired,
    computeContributor: PropTypes.object.isRequired,
    id: PropTypes.string,
    type: PropTypes.string.isRequired,
    expandedValue: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    // Only fetch from server if expanded value isn't provided
    if (!this.props.expandedValue && this.props.id) {
      switch (this.props.type) {
        case 'FVWord':
          this.props.fetchWord(this.props.id);
        break;

        case 'FVPhrase':
          this.props.fetchPhrase(this.props.id);
        break;

        case 'FVCategory':
          this.props.fetchCategory(this.props.id);
        break;

        case 'FVPicture':
            this.props.fetchPicture(this.props.id);
        break;

        case 'FVAudio':
            this.props.fetchAudio(this.props.id);
        break;

        case 'FVVideo':
            this.props.fetchVideo(this.props.id);
        break;

        case 'FVContributor':
            this.props.fetchContributor(this.props.id);
        break;
      }
    }
  }

  render() {

      let previewStyles = {
        padding: '10px'
      }

      let body = <CircularProgress mode="indeterminate" size={1} />;

      switch (this.props.type) {
        case 'FVWord':
          let word = {};
          let wordResponse;

          if (this.props.expandedValue) {
            word.success = true;
            wordResponse = this.props.expandedValue;
          }
          else {
            word = selectn('words.' + this.props.id, this.props.computeWord);
            wordResponse = selectn('response', word);
          }

          if (wordResponse && word.success) {
            body = <div><strong>{wordResponse.title}</strong></div>;
          }
        break;

        case 'FVPhrase':
          let phrase = {};
          let phraseResponse;

          if (this.props.expandedValue) {
            phrase.success = true;
            phraseResponse = this.props.expandedValue;
          }
          else {
            phrase = selectn('phrases.' + this.props.id, this.props.computePhrase);
            phraseResponse = selectn('response', phrase);
          }

          if (phraseResponse && phrase.success) {
            body = <div><strong>{phraseResponse.title}</strong></div>;
          }
        break;

        case 'FVCategory':

          let category = {};
          let categoryResponse;

          if (this.props.expandedValue) {
            category.success = true;
            categoryResponse = this.props.expandedValue;
          }
          else {
            category = selectn('categories.' + this.props.id, this.props.computeCategory);
            categoryResponse = selectn('response', category);
          }

          if (categoryResponse && category.success) {

            let breadcrumb = [];

            selectn('contextParameters.breadcrumb.entries', categoryResponse).map(function(entry, i) {
              if (entry.type === 'FVCategory') {
                breadcrumb.push(<span key={i}> &raquo; {entry.title}</span>);
              }
            });

            body = <div><strong>{breadcrumb}</strong></div>;
          }
        break;

        case 'FVPicture':

          let picture = {};
          let pictureResponse;

          if (this.props.expandedValue) {
            picture.success = true;
            pictureResponse = this.props.expandedValue;
          }
          else {
            picture = selectn('pictures.' + this.props.id, this.props.computePicture);
            pictureResponse = selectn('response', picture);
          }

          if (pictureResponse && picture.success) {
            body = <div>
              <strong>{selectn('title', pictureResponse)}</strong> 
              <span> {selectn('properties.dc:description', pictureResponse)}</span><br/>
              <img src={selectn('properties.file:content.data', pictureResponse)} alt={selectn('title', pictureResponse)} />
            </div>;
          }

        break;

        case 'FVAudio':

          let audio = {};
          let audioResponse;

          if (this.props.expandedValue) {
            audio.success = true;
            audioResponse = this.props.expandedValue;
          }
          else {
            audio = selectn('audios.' + this.props.id, this.props.computeAudio);
            audioResponse = selectn('response', audio);
          }

          if (audioResponse && audio.success) {
            body = <div>
              <strong>{selectn('title', audioResponse)}</strong> 
              <span> {selectn('properties.dc:description', audioResponse)}</span><br/>
              <audio src={selectn('properties.file:content.data', audioResponse)} controls />
            </div>;
          }

        break;

        case 'FVVideo':

          let video = {};
          let videoResponse;

          if (this.props.expandedValue) {
            video.success = true;
            videoResponse = this.props.expandedValue;
          }
          else {
            video = selectn('videos.' + this.props.id, this.props.computeVideo);
            videoResponse = selectn('response', video);
          }

          if (videoResponse && video.success) {
            body = <div>
              <strong>{selectn('title', videoResponse)}</strong> 
              <span> {selectn('properties.dc:description', videoResponse)}</span><br/>
              <video width="320" height="240" src={selectn('properties.file:content.data', videoResponse)} controls />
            </div>;
          }

        break;

        case 'FVContributor':

          let contributor = {};
          let contributorResponse;

          if (this.props.expandedValue) {
            contributor.success = true;
            contributorResponse = this.props.expandedValue;
          }
          else {
            contributor = selectn('contributors.' + this.props.id, this.props.computeContributor);
            contributorResponse = selectn('response', contributor);
          }

          if (contributorResponse && contributor.success) {
            body = <div>
              <strong>{selectn('title', contributorResponse)}</strong> 
              <span> {selectn('properties.dc:description', contributorResponse)}</span><br/>
            </div>;
          }

        break;
      }

      return (
        <Paper style={previewStyles} zDepth={3}>
          {body}
        </Paper>
      );
    }
}