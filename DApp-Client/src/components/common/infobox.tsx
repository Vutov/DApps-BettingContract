import * as React from 'react';
import * as $ from "jquery";
import observer from '../../services/observer';
import { forIn } from 'lodash'
import { Alert } from 'react-bootstrap'

export default class Infobox extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            type: 'loading',
            visible: false
        };

        observer.showLoading = this.showLoading.bind(this);
        observer.showSuccess = this.showSuccess.bind(this);
        observer.showError = this.showError.bind(this);
    }

    componentDidMount() {
        $(document).on({
            ajaxStart: function () {
                if (this.state.visible === false) {
                    this.setState({ message: 'Loading...', type: 'loading', visible: true })
                }
            }.bind(this),
            ajaxStop: function () {
                if (this.state.type === 'loading') {
                    this.hide();
                }
            }.bind(this),
            ajaxError: function (e, response) {
                let errorMsg = JSON.stringify(response);
                if (response.readyState === 0) {
                    errorMsg = "Cannot connect due to network error.";
                }

                if (response.responseJSON && response.responseJSON.error_description) {
                    errorMsg = response.responseJSON.error_description;
                }

                if (response.responseJSON && response.responseJSON.modelState) {// errorMsg = response.responseJSON.error_description; // TODO Binding Jquery element and put in lable or somethin`
                    let models = response.responseJSON.modelState;
                    let message = response.responseJSON.message;
                    forIn(models, function (value, key) {
                        message += ' ' + value;
                    })

                    errorMsg = message;
                }
                else if (response.responseJSON && response.responseJSON.message) {
                    errorMsg = response.responseJSON.message;
                }

                this.showError(errorMsg);
            }.bind(this)
        });
    }

    hide() {
        this.setState({ visible: false });
    }

    showLoading(message) {
        this.setState({ message: message, type: 'loading', visible: true });
    }

    showSuccess(message) {
        this.setState({ message: message, type: 'success', visible: true });
        setTimeout(this.hide.bind(this), 3000);
    }

    showError(errorMsg) {
        this.setState({ message: errorMsg, type: 'error', visible: true });
    }

    render() {
        if (!this.state.visible) return null;

        let className = '';
        switch (this.state.type) {
            case 'loading':
                className += 'info';
                break;
            case 'error':
                className += 'danger';
                break;
            case 'success':
                className += 'success';
                break;
            default:
                break;
        }

        return (
            <div className='container hoverable'>
                <Alert bsStyle={className} onClick={this.hide.bind(this)}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}
