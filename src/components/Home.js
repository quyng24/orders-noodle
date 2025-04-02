import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../help/config";
import { FaHome } from "react-icons/fa";
import { Modal } from 'antd';

let dataall = [];
let newOrder = {};
function Home() {
    const [data, setData] = useState([]);
    const [note, setNote] = useState('');
    const [isOpenModal, setIsOpenModal] = useState(false);
    useEffect(() => {
        let isMounted = true;
        const fetchMenu = async () => {
            try {
            const querySnapshot = await getDocs(collection(db, "menu"));
            const menu = [];
            querySnapshot.forEach(doc => {
                menu.push({ id: doc.id, ...doc.data() });
            });
            if (isMounted) {
                setData(menu);
                dataall = menu;
            }
            } catch (error) {
            console.error("Error fetching orders:", error);
            }
        };
        fetchMenu();
        return () => {
            isMounted = false; 
        };
    }, []);
    const categoryDish = dataall.map(dt => dt.category);
    const uniqueCategories = [...new Set(categoryDish)];
    const handleCategoryClick = e => {
        switch(e.target.textContent) {
            case 'MỲ TRỘN':
                setData(dataall.filter(item => item.category === 'Mỳ Trộn'));
                break;
            case 'TOPPING':
                setData(dataall.filter(item => item.category === 'topping'));
                break;
            default:
                setData(dataall);
        }
    }
    const handleHomeClick = () => {
        setData(dataall);
    }
    async function handleClickOrder(item) {
        try {
            setIsOpenModal(true);
            Object.assign(newOrder, {item: {
                dish: { idDish: `${item.category}-${item.priceDish}`, nameDish: item.nameDish || '', price: item.priceDish || 0 },
                topping: { idTopping: `${item.category}-${item.priceTopping}`, nameTopping: item.nameTopping || '', price: item.priceTopping || 0 },
            }});
            Object.assign(newOrder, {totalPrice: item.priceDish || 0 + item.priceTopping || 0});
            Object.assign(newOrder, {createdAt: new Date()});
            // const docRef = await addDoc(collection(db, "orders"), newOrder);
        } catch (error) {
            console.error("Lỗi khi thêm đơn hàng:", error);
        }
    }
    const handleCancel = () => {
        setIsOpenModal(false);
    };
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderData = Object.fromEntries(formData.entries());
        setNote(orderData.note);
        let uploadNewOrder = {
            ...newOrder,
            addNoodle: Number(orderData.addNoodle),
            spicy: orderData.spicy || null,
            drink: orderData.drink || null,
            takeaway: orderData.takeaway || null,
            note: orderData.note,
        };
        await addDoc(collection(db, "orders"), uploadNewOrder);
        setIsOpenModal(false);
    }
    return (
        <>
            <div className="category">
                <div className="category__all">
                    <button onClick={handleHomeClick}><FaHome /></button>
                </div>
                <ul>
                    {uniqueCategories.map((cy, index) => (
                        <li key={index}>
                            <a onClick={handleCategoryClick} href={`#${cy.toLowerCase()}`}>{cy.toUpperCase()}</a>
                        </li>
                    )) || []}
                </ul>
            </div>
            <div className="product">
                {data.map(item => (
                    <div className="product__item" key={item.id}>
                        <img className="ptoduct__img" src={item.img} alt={item.name} />
                        <div className="product__content">
                            <h3 className="product__title">{item.nameDish || item.nameDrink || item.nameTopping}</h3>
                            <div className="product__bottom">
                                <p className="product__price">{item.priceDish || item.priceDrink || item.priceTopping}k</p>
                                <button onClick={() => handleClickOrder(item)}>Đặt món</button>
                                <Modal open={isOpenModal} onCancel={handleCancel}>
                                    <form onSubmit={handleSubmitForm} id="simple-order">
                                        <div className="question">
                                            <p style={{marginBottom: '10px'}}>Bạn muốn ăn mấy gói mì?</p>
                                            <input className="note-order" type="number" name="addNoodle"/>
                                        </div>
                                        <div className="question">
                                            <p>Độ cay:</p>
                                            <input type="radio" name="spicy" value="ít cay" id="mild"/> <label htmlFor="mild">Ít cay</label><br/>
                                            <input type="radio" name="spicy" value="cay vừa" id="medium"/> <label htmlFor="medium">Cay vừa</label><br/>
                                            <input type="radio" name="spicy" value="cay nhiều" id="hot"/> <label htmlFor="hot">Cay nhiều</label><br/>
                                        </div>
                                        <div className="question">
                                            <p>Mang về?</p>
                                            <input type="radio" name="takeaway" value="có" id="yes"/> <label htmlFor="yes">Có</label><br/>
                                            <input type="radio" name="takeaway" value="không" id="no"/> <label htmlFor="no">Không</label><br/>
                                        </div>
                                        <div className="question">
                                            <label htmlFor="beverageSelect">Loại nước:</label>
                                            <select id="beverageSelect" name="drink">
                                                <option value="">-- Vui lòng chọn --</option>
                                                <option value="nuoc_loc">Nước lọc</option>
                                                <option value="tra">Trà xanh</option>
                                                <option value="c2">C2</option>
                                                <option value="tra_olong">Trà Olong</option>
                                                <option value="sting_do">Sting đỏ</option>
                                                <option value="sting_vang">Sting vàng</option>
                                            </select>
                                        </div>
                                        <div className="note">
                                            <p>Ghi chú</p><br/>
                                            <input className="note-order" type="text" name="note" onChange={(e) => setNote(e.target.value)}/>
                                        </div>
                                        <button type="submit">Đặt</button>
                                    </form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
export default Home;