import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../help/config";

function Orders() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "orders"), (querySnapshot) => {
            const orders = [];
            querySnapshot.forEach(doc => {
                const orderData = { id: doc.id, ...doc.data() };
                let extraCost = 0;
                if (orderData.addNoodle === 2 && orderData.item.nameDish !== 'Mì trộn siêu topping') extraCost += 7;
                if (orderData.addNoodle === 3) extraCost += 14;
                if (orderData.takeaway === "có") extraCost += 2;
                orderData.totalPrice += extraCost;
                orders.push(orderData);
            });
            setData(orders);
        });
        return () => unsubscribe();
    }, []);
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = timestamp.toDate();
        return date.toLocaleString("vi-VN", { 
            year: "numeric", 
            month: "2-digit", 
            day: "2-digit", 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit" 
        });
    };
    // const handleComplete = (orderId) => {
    //     setCompletedOrders((prev) => new Set(prev).add(orderId));
    // };
    const handleComplete = async (orderId) => {
        try {
            await updateDoc(doc(db, "orders", orderId), { isCompleted: true });
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error);
        }
    };
    return (
        <>
            <div className="order">
                {data.map((dt, index) => (
                    <div key={index} className={dt.isCompleted ? 'order__item--red' : 'order__item'}>
                        <div className="order__content">
                            <h3 className={dt.isCompleted ? 'order__title--red' : ''}>Tên món ăn: {dt.item.dish.nameDish ||  dt.item.drink.nameDrink || dt.item.topping.nameTopping || ''}</h3>
                            <ul>
                                <li>Giờ đặt: {formatDate(dt.createdAt)}</li>
                                <li>Sức ăn: {dt.addNoodle <= 0 ? 1 : dt.addNoodle} gói</li>
                                <li>Độ lì: {dt.spicy}</li>
                                <li>Ghi chú: {dt.note}</li>
                                <li>{dt.takeaway === "có" ? 'Mang về' : 'Ăn tại quán'}</li>
                            </ul>
                            <h3>Tổng giá: {dt.calculatedPrice || dt.totalPrice}k</h3>
                        </div>
                        <button disabled={dt.isCompleted} onClick={() => handleComplete(dt.id)}>Hoàn thành</button>
                    </div>
                )).reverse()}
            </div>
        </>
    )
}
export default Orders;