import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
 // optional external CSS if needed

function NotionalRoutes() {
    const routes = [
        { from: "India", fromCode: "IND", to: "USA", toCode: "USA", fare: "$30" },
        { from: "India", fromCode: "IND", to: "Canada", toCode: "CAN", fare: "$50" },
        { from: "USA", fromCode: "USA", to: "UK", toCode: "UK", fare: "$60" },
        { from: "USA", fromCode: "USA", to: "Australia", toCode: "AUS", fare: "$70" },
        { from: "UK", fromCode: "UK", to: "India", toCode: "IND", fare: "$80" },
        { from: "Canada", fromCode: "CAN", to: "India", toCode: "IND", fare: "$90" },
        { from: "Australia", fromCode: "AUS", to: "India", toCode: "IND", fare: "$100" },
        { from: "Australia", fromCode: "AUS", to: "USA", toCode: "USA", fare: "$110" },
        { from: "Canada", fromCode: "CAN", to: "USA", toCode: "USA", fare: "$120" },
        { from: "UK", fromCode: "UK", to: "Canada", toCode: "CAN", fare: "$130" }   
        
    ];

    return (
        <div className="routes-container my-5">
            <h4 className="mb-3">National Travel Routes</h4>
            <table className="routes-table table table-bordered">
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Fare</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route, index) => (
                        <tr key={index}>
                            <td>{route.from} ({route.fromCode})</td>
                            <td>{route.to} ({route.toCode})</td>
                            <td>{route.fare}</td>
                            <td>
                                <button className="btn btn-primary btn-sm">View More</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NotionalRoutes;
