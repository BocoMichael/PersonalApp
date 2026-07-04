import react from "react";


function ExpenseList({ expenses }) {
    return (
        <section style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <h2>Expenses</h2>
            {expenses.length === 0 ? (
                <p>No expense records yet.</p>

            ) : (
                <ul>
                    {expenses.map((item) => (
                        <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                            <strong>${Number(item.amount).toFixed(2)}</strong> for {item.category || 'Unknown'}
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{item.date || 'No date'}</div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default ExpenseList;
