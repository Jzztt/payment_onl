import { Button, Card, Col, Form, Input, Radio, Row, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const data = [
  {
    key: 1,
    name: "Sản phẩm 1",
    price: 1000,
    quantity: 1,
  },
  {
    key: 2,
    name: "Sản phẩm 2",
    price: 2000,
    quantity: 2,
  },
  {
    key: 3,
    name: "Sản phẩm 3",
    price: 3000,
    quantity: 3,
  },
];

const columns = [
  {
    title: "Tên sản phảm",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
];

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<string>("VNPAY");
  const nav = useNavigate();

  // xử lý call api thanh toán
  const handlePayment = async () => {
    // tổng tiền
    const total = data.reduce((init, item) => {
      return (init += item.price * item.quantity);
    }, 0);
    // console.log(total);

    // phương thức thanh toán
    // console.log(paymentMethod);

    // xử lý thanh toán bằng vnpay
    try {
      // VNPAY
      console.log(paymentMethod);

      if (paymentMethod == "VNPAY") {
        const { data } = await axios.get(
          `http://localhost:3000/create_payment?amount=${total}`
        );

        window.location.href = data.paymentUrl;
      } else if (paymentMethod == "ZALOPAY") {
        const { data } = await axios.post(
          `http://localhost:3000/create_zalopay_order?amount=${total}`
        );
        console.log(data);
        window.location.href = data.order_url;
      }
      // ZALOPAY
    } catch (error) {}
  };

  return (
    <div>
      <h1>Thanh toán</h1>
      <Row>
        <Col span={14}>
          {/* Thông tin nhận */}
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item label="Họ và tên" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Sô điện thoại" name="phone">
              <Input type="number" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Col>

        <Col span={10}>
          {/* Thông tin sản phẩm */}
          <Card title="Thông tin sản phẩm">
            <Table pagination={false} dataSource={data} columns={columns} />
            <h3>Tổng tiền: 3000</h3>

            <Radio.Group
              defaultValue={"VNPAY"}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <Radio value={"VNPAY"}>VNPAY</Radio>
              <Radio value={"ZALOPAY"}>ZALOPAY</Radio>
              <Radio value={"COD"}>Ship COD</Radio>
            </Radio.Group>

            <Button
              onClick={handlePayment}
              style={{ marginTop: 20 }}
              color="primary"
              variant="solid"
            >
              Thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Checkout;
