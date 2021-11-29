import React from "react";
import { Modal, Button, AutoComplete, Input } from 'antd';
import { BigNumber, Contract, utils } from "ethers";
import styles from "../css/bonds.module.css";
import { getDisplayBalance } from "../../../eigma-cash/format_util";
import config from "../../../config";
type IMyComponentState = {
    value: string;
    isModalVisible: boolean;
    disabled: boolean;
    amount: number;
    isApprove: boolean;
    provider: any;
}
type IMyComponentProps = {
    disView: boolean,
    closeView: any,
    openView: any,
    contracts: any,
    provider: any,
    index: any
}
export class ModuleOne extends React.Component<IMyComponentProps, IMyComponentState> {
    public provider: any;
    public contracts: any;
    public walletWithProvider: any;
    public currentAddress: any;
    public amount: any;
    public orderAddress: any;
    public index: any;
    public externalTokens: any;
    public constructor(props?: any, context?: any) {
        super(props);
        this.state = {
            value: "",
            amount: 0,
            isModalVisible: false,
            disabled: true,
            isApprove: true,
            provider: this.props.provider
        };
        const { externalTokens } = config;
        this.externalTokens = externalTokens;
        this.contracts = {};
    }

    componentDidMount() {
        this.init(this.props);
    }
    UNSAFE_componentWillReceiveProps(nextProps: any) {
        if (!nextProps || this.provider != nextProps.provider || this.contracts != nextProps.contracts || this.index != nextProps.index) {
            this.init(nextProps);
        }
    }
    public async init(nextProps: any) {
        if (!nextProps || !nextProps.contracts || !nextProps.provider) {
            return;
        }
        this.contracts = nextProps.contracts;
        this.provider = nextProps.provider;
        this.index = nextProps.index;
    }



    public order = async () => {
        if (!this.provider) {
            alert("No wallet connected");
            return;
        }
        if (this.index != 0 && !this.index) {
            alert("Error");
            return;
        }
        this.currentAddress = await this.provider.getAddress();
        var abi = require("../../../eigma-cash/deployments/dex.json");
        this.contracts["dex"] = new Contract(this.externalTokens["dex"][0], abi, this.provider);
        var address = this.orderAddress ? this.orderAddress : this.currentAddress;
        var ce = await this.contracts["dex"].bid(address, this.index);
    }
    public setAddress = (e: any) => {
        this.orderAddress = e.currentTarget.value;
    }
    public render() {
        var { value, isApprove } = this.state;
        return (
            <div>
                <Modal title="Deposit for SASH" visible={this.props.disView} footer={null} onOk={this.props.openView} onCancel={this.props.closeView}>
                    <div style={{ marginLeft: " 9%" }}>
                        address:  <Input type="text" placeholder="(Address of inputs)" style={{ width: "300px", marginBottom: "10px", height: "35px" }} className={styles.amountNmuber} onBlur={this.setAddress} />
                    </div>
                    <div className={styles.disButton}>

                        <button className={styles.buttona} onClick={this.order}>Take Order</button></div>


                </Modal>
            </div>
        )
    }
}