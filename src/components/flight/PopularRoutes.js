import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PopularRoutes.css'; // optional external CSS if needed

function PopularRoutes() {
    const routes = [
        { from: "Mumbai", fromCode: "BOM", to: "Goa", toCode: "GOI", fare: "$28" },
        { from: "Mumbai", fromCode: "BOM", to: "Hyderabad", toCode: "HYD", fare: "$42" },
        { from: "Hyderabad", fromCode: "HYD", to: "Delhi", toCode: "DEL", fare: "$44" },
        { from: "Hyderabad", fromCode: "HYD", to: "Mumbai", toCode: "BOM", fare: "$51" },
        { from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM", fare: "$63" },
        { from: "Channai", fromCode: "CHE", to: "Hydarbad", toCode: "HYD", fare: "$51" },
        { from: "Channai", fromCode: "CHE", to: "Delhi", toCode: "DEL", fare: "$63" },
        { from: "Channai", fromCode: "CHE", to: "Mumbai", toCode: "BOM", fare: "$70" },
        { from: "Delhi", fromCode: "DEL", to: "Goa", toCode: "GOI", fare: "$80" },
        { from: "Goa", fromCode: "GOI", to: "Mumbai", toCode: "BOM", fare: "$28" }
    ];

    return (
        <div className="routes-container my-5">
            <h4 className="mb-3">Popular Travel Routes</h4>
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

export default PopularRoutes;
