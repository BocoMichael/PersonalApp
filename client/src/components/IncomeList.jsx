import React from 'react';


function IncomeList({ income }) {
    return (
        <section style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <h2>Income</h2>
            {income.length === 0 ? (
                <p>No income records yet.</p>
            ) : (
                <ul>
                    {income.map((item) => (
                        <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                            <strong>${Number(item.amount).toFixed(2)}</strong> from {item.source || 'Unknown'}
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{item.date || 'No date'}</div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default IncomeList;