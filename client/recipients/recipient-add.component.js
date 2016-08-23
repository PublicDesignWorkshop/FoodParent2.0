import React from 'react';
import AltContainer from 'alt-container';

require('./recipient-add.component.scss');

let ServerSetting = require('./../../setting/server.json');
import { localization } from './../utils/localization';
import MapRecipient from './../maps/map-recipient.component';
import RecipientAddPanel from './recipient-add-panel.component';
import { DONATIONADDMODE } from './../utils/enum';
let MapStore = require('./../stores/map.store');
let LocationStore = require('./../stores/location.store');
let LocationActions = require('./../actions/location.actions');


export default class RecipientAdd extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    LocationActions.fetchLocations(0);
    this.updateProps(this.props);
  }
  componentDidMount () {

  }
  componentWillReceiveProps(nextProps) {
    this.updateProps(nextProps);
  }
  updateProps(props) {
    let mode;
    let open;
    // Instead of changing url, change # hashtag to remove extra rendering process.
    switch(props.location.hash.replace('#', '')) {
      case "":
        mode = DONATIONADDMODE.MARKER;
        open = false;
        break;
      case "info":
        mode = DONATIONADDMODE.INFO;
        open = true;
        break;
      default:
        mode = DONATIONADDMODE.MARKER;
        open = false;
        break;
    }
    this.setState({mode: mode, open: open});
  }
  render () {
    let action = <div className="popup-message">
      <span dangerouslySetInnerHTML={{__html: localization(662)}} />
      <span className="popup-button" onClick={()=> {
        this.context.router.push({pathname: ServerSetting.uBase + '/addrecipient', hash: '#info'});
      }}>
        {localization(929)}
      </span>
    </div>;

    if (this.state.mode == DONATIONADDMODE.INFO) {
      action = <div className="popup-message">
        <span dangerouslySetInnerHTML={{__html: localization(641)}} />
      </div>;
    }

    return (
      <div className="recipient-map-wrapper">
        <AltContainer stores={
          {
            position: function(props) {
              return {
                store: MapStore,
                value: MapStore.getState().location
              };
            },
            locations: function(props) {
              return {
                store: LocationStore,
                value: LocationStore.getState().locations
              }
            },
            selected: function(props) {
              return {
                store: LocationStore,
                value: LocationStore.getState().selected
              }
            },
          }
        }>
          <MapRecipient />
        </AltContainer>
        <RecipientAddPanel open={this.state.open} mode={this.state.mode} />
        <div className="popup-wrapper popup-green open">
          {action}
        </div>
      </div>
    );
  }
}
RecipientAdd.contextTypes = {
    router: React.PropTypes.object.isRequired
}
