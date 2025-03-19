import React, { Component } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../../utils/apiService';
import PropagateLoader from "react-spinners/PropagateLoader";
import 'react-loading-skeleton/dist/skeleton.css';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TypeAnimation } from 'react-type-animation';


class AiJulya extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataUser: {},
            loading: false,
            listPrompt: [],
            isResult: false,
            textAi: "",
            loaded: false,
            resultsList: [],
            listLang: [
                {
                    value: "EN",
                    label: "English"
                },
                {
                    value: "FR",
                    label: "Français"
                }
            ],
            dataPrompt: [],
            selectedPrompt: "",
            lang: ""
        }
        this.paragraphRef = React.createRef();
        this.editorRef = React.createRef();

    }
    sliderSettings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    }

    timeout = 0;

    componentDidMount() {
        let datacred = reactLocalStorage.get('credential');
        let islogin = reactLocalStorage.get('islogin');

        if (islogin === 'true' && datacred) {
        } else {
            window.location.assign('/login');
        }

        this.setState({
            dataUser: JSON.parse(datacred),
        }, () => {
            let tmpDataList = reactLocalStorage.get('tmpData-textai');
            if (tmpDataList) {
                let prompt = tmpDataList;
                this.setState({ textAi: prompt }, () => {
                    this.setState({ loaded: true })
                    console.log("textAi : ", this.state.textAi);
                })
            } else {
                this.setState({ loaded: true })
            }
            let tmpDataResult = reactLocalStorage.get('tmpData-resultai');
            if (tmpDataResult) {
                let lists = JSON.parse(tmpDataResult);
                this.setState({ isResult: true, resultsList: lists }, () => {
                })
            }
            this._getPrompt();
            if (this.editorRef.current) {
                const editor = this.editorRef.current.editor;
                editor.ui.view.editable.style.height = '400px'; // Set the desired height in pixels
            }

        });
    }


    _goto(v, param) {
        this.props.history.push(v, param, "_blank");
    }


    _getPrompt = (loading) => {
        this.setState({ data: [] }, () => {
            let tmpRequest = {
                "user_id": this.state.dataUser.id_user
            };
            if (loading) {
                this._showLoading();
            }
            apiService.invoke("GET_PROMPT", tmpRequest,
                (success) => {
                    this._hideLoading();
                    if (success.code === '200') {
                        let final = [];
                        let datas = [];
                        let models = success.data;
                        for (let index = 0; index < models.length; index++) {
                            let obj = {
                                value: models[index].id_prompt,
                                label: models[index].title_prompt
                            }
                            if (models[index].status_prompt === '1') {
                                final.push(obj);
                                datas.push(models[index]);
                            }
                        } 
                        this.setState({ listPrompt: final, dataPrompt: datas });
                    }
                }, (error) => {
                    toast.error("Something went wrong, please reload page!");
                    this._hideLoading();
                });
        });
    }



    _submitAi = (loading) => {
        window.scrollTo(0, 0);
        this.setState({ data: [] }, () => {
            let tmpRequest = {
                "user_id": this.state.dataUser.id_user,
                "message": this.state.textAi
            };
            if (loading) {
                this._showLoading();
            }
            apiService.invoke("SUBMIT_AI", tmpRequest,
                (success) => {
                    this._hideLoading();
                    if (success.code === '200') {
                        let hasil = JSON.parse(success.data);
                        console.log("ai text : ", hasil);
                        this.setState({ isResult: true, resultsList: hasil.choices }, () => {
                            reactLocalStorage.set("tmpData-textai", tmpRequest.message);
                            reactLocalStorage.set("tmpData-resultai", JSON.stringify(hasil.choices));
                        });
                    }else if (success.code === '302') {
                        toast.warning("The AI count has reached limit, please upgrade plan");
                        this._goto("/upgrade");
                    } else if (success.code === '303') {
                        toast.warning("Your plan has expired, please upgrade plan");
                        this._goto("/upgrade");
                    }
                }, (error) => {
                    toast.error("Something went wrong, please reload page!");
                    this._hideLoading();
                });
        });

    }


    _showLoading() {
        this.setState({ loading: true })
    }
    _hideLoading() {
        this.setState({ loading: false })
    }

    _comingSoon() {
        toast.warning("This feature is still under development, Stay Tuned!");
    }

    _onChangeKeyword(evt) {
        let value = evt.target.value;
        this.setState({ keyword: value, emptyKeyword: false });
    }

    _onChangePeriod(evt) {
        let value = evt.target.value;
        this.setState({ days: value })
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this._getTiktokVideo(true);
        }
    }

    _handleCopy() {
        // Get the text content from the <p> element using the ref
        const textToCopy = this.paragraphRef.current.innerText;

        // Create a temporary textarea element
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;

        // Append the textarea to the document
        document.body.appendChild(tempTextArea);

        // Select the text in the textarea
        tempTextArea.select();

        // Execute the copy command
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(tempTextArea);

        // Optionally, you can provide user feedback or perform other actions
        console.log('Text copied:', textToCopy);
        toast.success("Transcript Copied to Clipboard");

    }

    _onChangePrompt(val) {
        let dataPrompt = this.state.dataPrompt;
        for (let index = 0; index < dataPrompt.length; index++) {
            if (val === dataPrompt[index].id_prompt) {
                if (this.state.lang === 'FR') {
                    this.setState({ textAi: dataPrompt[index].desc_prompt_fr, selectedPrompt: val });
                } else {
                    this.setState({ textAi: dataPrompt[index].desc_prompt, selectedPrompt: val });
                }
            }
        }
    }

    _onChangeLang(val) {
        this.setState({ loaded: false, lang: val }, () => {
            let dataPrompt = this.state.dataPrompt;
            for (let index = 0; index < dataPrompt.length; index++) {
                if (dataPrompt[index].id_prompt === this.state.selectedPrompt) {
                    if (val === 'FR') {
                        this.setState({ textAi: dataPrompt[index].desc_prompt_fr },);
                    } else {
                        this.setState({ textAi: dataPrompt[index].desc_prompt });
                    }
                }
            }
            console.log("val : ", val);
            this.setState({ loaded: true });
        });

    }

    handleEditorChange = (event, editor) => {
        const data = editor.getData();
        this.setState({ textAi: data }, () => {
            console.log("text : ", this.state.textAi);
        });
    };

    render() {
        const { isResult, loading, listPrompt, resultsList, textAi, loaded, listLang } = this.state;
        return (
            <div >
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="">
                            <div className='row'>
                                <div className='col-md-6 mb-3 text-primary'>
                                    <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                        <div className='card-header'>
                                            <div className='row'>
                                                <div className='col'>
                                                    <h5>Custom Your Prompt / Select Default Prompt..</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col-12 col-md-6 mb-2'>
                                                    <Select
                                                        isDisabled={loading}
                                                        ref={this.selectPrompt}
                                                        placeholder={"Select Prompt..."}
                                                        onChange={(val) => this._onChangePrompt(val.value)}
                                                        styles={{
                                                            option: (base) => ({
                                                                ...base,
                                                                height: '100%',
                                                                color: "#000",
                                                            })
                                                        }}
                                                        options={listPrompt}
                                                    />
                                                </div>
                                                <div className='col-12 col-md-6 mb-2'>
                                                    <Select
                                                        isDisabled={loading}
                                                        ref={this.selectPrompt}
                                                        placeholder={"Choose Language..."}
                                                        onChange={(val) => this._onChangeLang(val.value)}
                                                        styles={{
                                                            option: (base) => ({
                                                                ...base,
                                                                height: '100%',
                                                                color: "#000",
                                                            })
                                                        }}
                                                        options={listLang}
                                                    />
                                                </div>
                                            </div>
                                            <br />
                                            {
                                                loaded ? (
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={textAi}
                                                        config={{
                                                            toolbar: ['undo', 'redo', 'bold', 'italic', 'numberedList', 'alphabetList', 'bulletedList'],
                                                            placeholder: 'Type your prompt here...'
                                                        }}
                                                        onChange={this.handleEditorChange}
                                                        onBlur={this.handleEditorChange}
                                                        disabled={loading}
                                                    />
                                                ) : null
                                            }

                                            <div className='row mt-3'>
                                                <div className='col-12 col-md-3 mb-2'>
                                                    <button title="Reset" onClick={() => this.setState({ textAi: "" })} disabled={loading} className='btn btn-lg btn-info w-100'>
                                                        <span className='mdi mdi-refresh'></span>
                                                    </button>
                                                </div>
                                                <div className='col-12 col-md-4 mb-2'>
                                                    <button title="Stop" disabled={!loading} onClick={() => this._hideLoading()} className='btn btn-lg btn-dark w-100'>
                                                        <span className='mdi mdi-stop-circle'></span> Stop
                                                    </button>
                                                </div>
                                                <div className='col-12 col-md-5 mb-2'>
                                                    <button title="Generate" disabled={loading || textAi === ''} onClick={() => this._submitAi(true)} className='btn btn-lg btn-primary w-100'>
                                                        <span className='mdi mdi-arrow-right-drop-circle'></span> Generate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 text-primary'>
                                    {
                                        loading ? (
                                            <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                <div className='card-body text-primary'>
                                                    <div style={{ marginTop: '20%', marginBottom: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <center>
                                                            <PropagateLoader color='#2e1c5e' size={13} />
                                                            <h6 className='mt-5'>Hang on tight, we're cooking up the magic for you...</h6>
                                                        </center>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isResult ? (
                                            <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                <div className='card-header'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <h5>Julya's Answer...</h5>
                                                        </div>
                                                        <div className='col-auto'>
                                                            <button onClick={() => this._handleCopy()} className='btn btn-info'>
                                                                <i className='mdi mdi-content-copy'></i> Copy
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-body'>
                                                    {
                                                        resultsList.map((dat) => {
                                                            return (
                                                                <div className=''>
                                                                    <TypeAnimation
                                                                        ref={this.paragraphRef}
                                                                        sequence={[
                                                                            dat?.message?.content,
                                                                            1000,
                                                                        ]}
                                                                        speed={80}
                                                                        cursor={false}
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='card' style={{ boxShadow: '5px 5px 5px lightblue' }}>
                                                <div className='card-body text-primary'>
                                                    <div style={{ marginTop: '5%', marginBottom: '5%', alignItems: 'center', justifyContent: 'center' }}>
                                                        <center>
                                                            <img alt="notfound" src={require('../../assets/images/logo.png')} width={90} />
                                                            <h2 className='mt-4'>Hello {this.state.dataUser.nama}, Welcome to Julya AI<br></br><center>
                                                                <TypeAnimation
                                                                    className='mt-3'
                                                                    ref={this.paragraphRef}
                                                                    wrapper='p'
                                                                    cursor={false}
                                                                    sequence={[
                                                                        'We support you to produce marketing strategies for social media content with sophisticated artificial intelligence technology',
                                                                        1000,
                                                                    ]}
                                                                    speed={80}
                                                                />
                                                            </center></h2>
                                                        </center>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        );
    }
}

export default AiJulya;