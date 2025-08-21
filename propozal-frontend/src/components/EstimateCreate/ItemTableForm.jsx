// import React from 'react';
// import { Card, Table, Button, Form } from 'react-bootstrap';
//
// const ItemTableForm = () => {
//   return (
//     <Card className="mb-4">
//       <Card.Body>
//         <h5 className="fw-bold mb-3">📦 품목 리스트</h5>
//
//         <Table responsive bordered hover>
//           <thead className="table-light">
//             <tr>
//               <th>품목</th>
//               <th>수량</th>
//               <th>단가</th>
//               <th>공급가액</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>멋쟁이 사자 인형</td>
//               <td>
//                 <Form.Control type="number" defaultValue={10} />
//               </td>
//               <td>
//                 <Form.Control type="text" defaultValue="5,000.00" />
//               </td>
//               <td>50,000.00</td>
//             </tr>
//           </tbody>
//         </Table>
//
//         <div className="text-end mb-4">
//           <Button variant="outline-primary">+ 제품 추가</Button>
//         </div>
//
//         <h5 className="fw-bold mb-3">🎁 할인 적용</h5>
//
//         <Table responsive bordered>
//           <thead className="table-light">
//             <tr>
//               <th>할인 적용할 제품 선택</th>
//               <th>할인율 (%)</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>
//                 <Form.Select>
//                   <option>멋쟁이 사자 인형</option>
//                   <option>다른 제품</option>
//                 </Form.Select>
//               </td>
//               <td>
//                 <Form.Control type="number" placeholder="예: 10" />
//               </td>
//             </tr>
//           </tbody>
//         </Table>
//       </Card.Body>
//     </Card>
//   );
// };
//
// export default ItemTableForm;
