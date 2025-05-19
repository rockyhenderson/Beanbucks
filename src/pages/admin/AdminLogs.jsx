import React from 'react';
import styled from 'styled-components';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text);
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  
  h1 {
    color: var(--heading-color);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  p {
    color: var(--body-text);
    font-size: 1.1rem;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: var(--card);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    color: var(--accent);
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0.5rem 0;
    color: var(--text);
  }
  
  button {
    background: var(--primary);
    color: var(--button-text);
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    margin-top: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background: color-mix(in srgb, var(--primary), black 15%);
    }
  }
`;

const GuideCard = styled.div`
  background: var(--card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  
  h2 {
    color: var(--heading-color);
    font-size: 1.75rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 1.1rem;
    line-height: 1.5;
    
    strong {
      color: var(--accent);
      font-weight: 600;
    }
  }
`;

const StatHighlight = styled.span`
  color: var(--primary);
  font-weight: 700;
`;

function Admin() {
  return (
    <AdminContainer>
      <MainContent>
        <Header>
          <h1>
            <span>Admin Dashboard</span>
            <span style={{ color: 'var(--primary)' }}>🔧</span>
          </h1>
          <p>Overview and quick actions for store management</p>
        </Header>

        <StatsGrid>
          <StatCard>
            <h3>💰 Money Taken This Week</h3>
            <p>£<StatHighlight>1,234</StatHighlight>.56</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)' }}>↑ 12% from last week</p>
          </StatCard>
          
          <StatCard>
            <h3>🛒 Orders Placed</h3>
            <p><StatHighlight>342</StatHighlight> orders</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)' }}>↗ 8% from last week</p>
          </StatCard>
          
          <StatCard>
            <h3>🥇 Top-Selling Drink</h3>
            <p>Caramel Iced Latte</p>
            <p><StatHighlight>76</StatHighlight> sold this week</p>
          </StatCard>
          
          <StatCard>
            <h3>📉 Low Stock Items</h3>
            <p><StatHighlight>5</StatHighlight> items need attention</p>
            <button>View Stock</button>
          </StatCard>
          
          <StatCard>
            <h3>🏪 Store Status</h3>
            <p><StatHighlight>2</StatHighlight> stores closed</p>
            <button>Manage Stores</button>
          </StatCard>
          
          <StatCard>
            <h3>👥 New Customers</h3>
            <p><StatHighlight>28</StatHighlight> this week</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--body-text)' }}>Total: 1,842</p>
          </StatCard>
        </StatsGrid>

        <GuideCard>
          <h2>🧭 Quick Navigation Guide</h2>
          <ul>
            <li>
              <span>🍹</span>
              <div>
                <strong>Manage Menu</strong><br />
                Edit drink items and pricing
              </div>
            </li>
            <li>
              <span>👤</span>
              <div>
                <strong>User Management</strong><br />
                Manage staff and customers
              </div>
            </li>
            <li>
              <span>☕</span>
              <div>
                <strong>Barista Portal</strong><br />
                Live order view and management
              </div>
            </li>
            <li>
              <span>🏪</span>
              <div>
                <strong>Store Options</strong><br />
                Set hours, open/close stores
              </div>
            </li>
            <li>
              <span>📦</span>
              <div>
                <strong>Inventory</strong><br />
                View/update stock levels
              </div>
            </li>
            <li>
              <span>📜</span>
              <div>
                <strong>Activity Logs</strong><br />
                View admin activity history
              </div>
            </li>
          </ul>
        </GuideCard>
      </MainContent>
    </AdminContainer>
  );
}

export default Admin;