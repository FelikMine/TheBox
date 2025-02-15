import React from "react";
import Header from "../header/Header";
import { useState } from "react";
import classes from "./Charts.module.css"
import ApexChart from './ApexChart.jsx';
import ChartsColor from "./ChartsColor.jsx";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import ShortFooter from "../instruments/ShortFooter.jsx";
import CustomDropdown from "./CustomDropDown.jsx";
import {
    getTransfers,
    getBalance,
    getOrders,
    getDeals,
    getPairs,
    getExchanges,
    getAccounts,
} from './api.js';

export default function Charts() {

    const [existingAccounts, setExistingAccounts] = useState(new Set());

    const [coinBase, setCoinBase] = useState('');
    const [error, setError] = useState('');
    const [splitPairs, setSplitPairs] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedAccount2, setSelectedAccount2] = useState('');
    const [selectedAccount3, setSelectedAccount3] = useState('');

    //Пары, блоки аккаунтов, баланс, orders, deals
    const [balance, setBalance] = useState([]);
    const [deals, setDeals] = useState([]);
    const [orders, setOrders] = useState([]);
    const [pairs, setPairs] = useState([]);
    const [blocks, setBlocks] = useState([]);

    const [nowBalance1, setNowBalance1] = useState(['---', '---']);
    const [nowBalance2, setNowBalance2] = useState(['---', '---']);
    const [nowBalance3, setNowBalance3] = useState(['---', '---']);

    const [authenticated, setAuthenticated] = useState('');


    useEffect(() => {

        checkLocalStorage();

        function checkLocalStorage() {
            const loggedInUser = localStorage.getItem("authenticated");
            if (loggedInUser == "true") {
                setAuthenticated("true");
            } else {
                setAuthenticated("false");
            }
        }

        window.addEventListener('storage', checkLocalStorage)

        return () => {
            window.removeEventListener('storage', checkLocalStorage)
        }

    }, []);

    // const [orders1, setOrders1] = useState(['---', '---']); доработка

    useEffect(() => {
        const fetchData = async (account, setBalance) => {
            let pairs = splitPairs.join();
            let BalancePairs = pairs.replace('/', ',');
            let OrdersPairs = pairs.replace('/', '-');

            if (account && pairs) {
                const balance = await getBalance(account, BalancePairs);
                const orders = await getOrders(account, OrdersPairs);
                setOrders(orders);
                const deals = await getDeals(account, OrdersPairs);
                setDeals(deals);
                const transfers = await getTransfers(account, BalancePairs);

                console.log(`Баланс для аккаунта ${account}`, balance);
                console.log(`Ордера для аккаунта ${account}`, orders);
                console.log(`Сделки для аккаунта ${account}`, deals);
                console.log(`Переводы для аккаунта ${account}`, transfers);

                setBalance(balance); // Устанавливаем баланс после получения
            }
        };

        if (selectedAccount) {
            fetchData(selectedAccount, setNowBalance1);
        }
        if (selectedAccount2) {
            fetchData(selectedAccount2, setNowBalance2);
        }
        if (selectedAccount3) {
            fetchData(selectedAccount3, setNowBalance3);
        }
    }, [splitPairs, selectedAccount, selectedAccount2, selectedAccount3]);

    const handleCoinBaseChange = (e) => {

        const selectedPair = e.target.value; //выбранная пара
        setCoinBase(selectedPair); //задаем coinBase

        if (selectedPair) {
            const newPairs = selectedPair.split('/');
            setSplitPairs(newPairs);
            console.log('splitPairs:', newPairs);
        } else {
            setSplitPairs([]);
        }
    };

    useEffect(() => {

        const token = localStorage.getItem('accessToken');

        const fetchData = async () => {

            const pairs = await getPairs(token);
            setPairs(pairs);
            const exc = await getExchanges(token);
            setExchanges(exc);

        }

        if (token) {

            getAccounts(token, setBlocks, setExistingAccounts)
                .catch(error => {
                    console.error('Ошибка при получении аккаунтов:', error);
            });
            fetchData();
        }

    }, []);

    const AccountSelector = ({ value, onChange, blocks, placeholder }) => (
        <select value={value} onChange={onChange}>
            <option value="">{placeholder}</option>
            {blocks.map((account) => (
                <option key={account.id} value={account.id}>
                    {account.name}
                </option>
            ))}
        </select>
    );

    const BalanceBlock = ({ borderColor, value, currency }) => (
        <>
            <div style={{ borderColor }}>
                {value !== undefined ? value : '---'}
            </div>
            <span>
                {currency || '---'}
            </span>
        </>
    );
    const DataRow = ({ borderColor, label, value, amount }) => (
        <div style={{ borderColor }}>
            <span>{label}</span>
            <span>{value}</span>
            <span>{amount}</span>
        </div>
    );

    return (
        <ChartsColor>
        {(props) =>
        {
            const colorStyles = {
                'Green': { borderColor: '#2A5757', backgroundColor: '#2A5757' },
                'Purple': { borderColor: '#781E79', backgroundColor: '#781E79' },
                'Yellow': { borderColor: '#796E1E', backgroundColor: '#796E1E' },
                default: { borderColor: 'transparent', backgroundColor: '#FFFFFF' },
            };

            const getStyles = (value) => {
                return colorStyles[value] || colorStyles.default;
            };

            const { borderColor: borderColor1, backgroundColor: backgroundColor1 } = getStyles(props.selectedValue);
            const { borderColor: borderColor2, backgroundColor: backgroundColor2 } = getStyles(props.selectedValue2);
            const { borderColor: borderColor3, backgroundColor: backgroundColor3 } = getStyles(props.selectedValue3);

            if (authenticated == "false") {
                    // Redirect
                    return <Navigate replace to="/main" />;

            } else if (authenticated === '') {
                    return <div>Загрузка...</div>; // Временный экран загрузки
            }
            else if (authenticated =="true") {

            return (
            <>
            <div className={classes.wrapper}>

            <Header></Header>
            <div className={classes.backgrondPhoto}></div>

            <div >

            <div className={classes.CoinBase}>
                <div>
                    <span> Coin/Base </span>
                    <select value={coinBase} onChange={handleCoinBaseChange}>
                    <option value="">Выберите пару</option>
                        {pairs.map((pair, index) => (
                            <option key={pair} value={pair}>
                                {pair}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div id={classes.ChartContainter}>
                <div id="app">
                    <ApexChart
                        selectedValue={props.selectedValue}
                        selectedValue2={props.selectedValue2}
                        selectedValue3={props.selectedValue3}
                    />
                </div>
            </div>

            <div className={classes.ChartsContent}>
                <div className={classes.GridTable}>
                    <div style={{backgroundColor: backgroundColor3}}>
                        <div >
                        </div>
                    </div>

                    <div>

                        <div style={{borderColor: borderColor3}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor1}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                    </div>

                    <div>
                        <div className={classes.firstLine}>

                            <AccountSelector
                                value={selectedAccount2}
                                onChange={(e) => setSelectedAccount2(e.target.value)}
                                blocks={blocks}
                                placeholder="Выбрать аккаунт"
                            />

                            <BalanceBlock borderColor={borderColor1} value={nowBalance2[0]} currency={splitPairs[0]} />

                            <CustomDropdown
                                selectedValue={props.selectedValue}
                                setSelectedValue={props.setSelectedValue}
                                backgroundColor1={backgroundColor1}
                            />

                            <BalanceBlock borderColor={borderColor1} value={nowBalance2[1]} currency={splitPairs[1]} />

                        </div>

                        <div className={classes.secondLine}>
                            <div style={{borderColor: borderColor1}} >ask</div>
                            <div style={{borderColor: borderColor1}}>32415.7292</div>
                            <div style={{borderColor: borderColor1}}>1000</div>
                            <div style={{borderColor: borderColor1}}>bid</div>
                            <div style={{borderColor: borderColor1}}>32415.7292</div>
                            <div style={{borderColor: borderColor1}}>1000</div>

                            <div id={classes.shadow}></div>
                            <div id={classes.shadow}></div>
                            <div id={classes.shadow}></div>

                            <div style={{borderColor: borderColor1}}>buy</div>
                            <div style={{borderColor: borderColor1}}>32415.7292</div>
                            <div style={{borderColor: borderColor1}}>1000</div>
                            <div style={{borderColor: borderColor1}}>sell</div>
                            <div style={{borderColor: borderColor1}}>32415.7292</div>
                            <div style={{borderColor: borderColor1}}>1000</div>
                        </div>
                        <div>

                        </div>

                    </div>

                    <div>
                        <div style={{borderColor: borderColor2}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor2}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>
                        <div style={{borderColor: borderColor2}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor1}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                    </div>

                    <div>
                        <div className={classes.firstLine}>

                                <AccountSelector
                                    value={selectedAccount3}
                                    onChange={(e) => setSelectedAccount3(e.target.value)}
                                    blocks={blocks}
                                    placeholder="Выбрать аккаунт"
                                />

                                <BalanceBlock borderColor={borderColor2} value={nowBalance3[0]} currency={splitPairs[0]} />

                                <CustomDropdown
                                    selectedValue={props.selectedValue2}
                                    setSelectedValue={props.setSelectedValue2}
                                    backgroundColor1={backgroundColor2}
                                />

                                <BalanceBlock borderColor={borderColor2} value={nowBalance3[1]} currency={splitPairs[1]} />
                            </div>

                            <div className={classes.secondLine}>
                                <div style={{borderColor: borderColor2}} >ask</div>
                                <div style={{borderColor: borderColor2}}>32415.7292</div>
                                <div style={{borderColor: borderColor2}}>1000</div>
                                <div style={{borderColor: borderColor2}}>bid</div>
                                <div style={{borderColor: borderColor2}}>32415.7292</div>
                                <div style={{borderColor: borderColor2}}>1000</div>

                                <div id={classes.shadow}></div>
                                <div id={classes.shadow}></div>
                                <div id={classes.shadow}></div>

                                <div style={{borderColor: borderColor2}}>buy</div>
                                <div style={{borderColor: borderColor2}}>32415.7292</div>
                                <div style={{borderColor: borderColor2}}>1000</div>
                                <div style={{borderColor: borderColor2}}>sell</div>
                                <div style={{borderColor: borderColor2}}>32415.7292</div>
                                <div style={{borderColor: borderColor2}}>1000</div>
                            </div>
                            <div>

                        </div>
                    </div>

                    <div>
                        <div style={{borderColor: borderColor2}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor3}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor2}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor3}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>
                    </div>

                    <div>

                    <div className={classes.firstLine}>
                            <AccountSelector
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    blocks={blocks}
                                    placeholder="Выбрать аккаунт"
                            />
                            <BalanceBlock borderColor={borderColor3} value={nowBalance1[0]} currency={splitPairs[0]} />

                            <CustomDropdown
                                selectedValue={props.selectedValue3}
                                setSelectedValue={props.setSelectedValue3}
                                backgroundColor1={backgroundColor3}
                            />

                            <BalanceBlock borderColor={borderColor3} value={nowBalance1[1]} currency={splitPairs[1]} />
                    </div>

                            <div className={classes.secondLine}>
                                <div style={{borderColor: borderColor3}} >ask</div>
                                <div style={{borderColor: borderColor3}}>32415.7292</div>
                                <div style={{borderColor: borderColor3}}>1000</div>
                                <div style={{borderColor: borderColor3}}>bid</div>
                                <div style={{borderColor: borderColor3}}>32415.7292</div>
                                <div style={{borderColor: borderColor3}}>1000</div>

                                <div id={classes.shadow}></div>
                                <div id={classes.shadow}></div>
                                <div id={classes.shadow}></div>

                                <div style={{borderColor: borderColor3}}>buy</div>
                                <div style={{borderColor: borderColor3}}>32415.7292</div>
                                <div style={{borderColor: borderColor3}}>1000</div>
                                <div style={{borderColor: borderColor3}}>sell</div>
                                <div style={{borderColor: borderColor3}}>32415.7292</div>
                                <div style={{borderColor: borderColor3}}>1000</div>
                            </div>
                            <div>

                        </div>
                    </div>

                    <div>
                    <div style={{borderColor: borderColor3}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>

                        <div style={{borderColor: borderColor1}}>
                            <span>3.2</span>
                            <span>btc</span>
                            <span></span>
                            <span>1234.56</span>
                        </div>
                    </div>

                    <div style={{backgroundColor: backgroundColor1}}></div>

                    </div>
                </div>
            </div>

            <ShortFooter></ShortFooter>
        </div>
        </>
        )};
        }}
        </ChartsColor>
    );
}


