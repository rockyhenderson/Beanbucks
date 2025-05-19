import React from 'react';
import styled from 'styled-components';

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: var(--background);
  color: var(--text);
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
    color: var(--heading-color);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1rem;
  }
`;

const Card = styled.div`
  background-color: var(--card);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0.5rem 0;
    color: var(--text);
    
    span {
      color: var(--primary);
    }
  }
  
  .stat-meta {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: auto;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap; /* Handles narrow screens */

  h2 {
    font-size: 1.5rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section-actions {
    max-width: 200px; /* or 250px if you need a bit more */
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
`;


const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);
    
    &:hover {
      background-color: rgba(238, 92, 1, 0.1);
    }
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const QuickActionCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  
  .icon {
    font-size: 1.5rem;
    background-color: rgba(238, 92, 1, 0.1);
    color: var(--primary);
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .content {
    h3 {
      font-size: 1rem;
      margin: 0 0 0.25rem 0;
      color: var(--text);
    }
    
    p {
      font-size: 0.85rem;
      margin: 0;
      color: var(--text-secondary);
    }
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const DataTable = styled(Card)`
  padding: 1rem;

  .data-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 6px;
    
    &:nth-child(odd) {
      background: rgba(255, 255, 255, 0.03);
    }
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--card-bg);
  
  .timestamp {
    font-size: 0.8rem;
    color: var(--text-secondary);
    min-width: 80px;
    margin-right: 1.5rem;
  }
  
  .activity-content {
    flex-grow: 1;
    
    p {
      margin: 0;
      font-size: 0.95rem;
    }
    
    .meta {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }
  }
`;

function AdminDashboard() {
  return (
    <DashboardContainer>
      <Header>
        <h1>📊 Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business today.</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <h3>💰 Weekly Revenue</h3>
          <div className="stat-value">£<span>1,842</span>.50</div>
          <div className="stat-meta">↑ 12% from last week</div>
        </StatCard>
        <StatCard>
          <h3>🛒 Total Orders</h3>
          <div className="stat-value"><span>342</span></div>
          <div className="stat-meta">↗ 24 new today</div>
        </StatCard>
        <StatCard>
          <h3>👥 New Customers</h3>
          <div className="stat-value"><span>28</span></div>
          <div className="stat-meta">12% conversion rate</div>
        </StatCard>
        <StatCard>
          <h3>⏱️ Avg. Prep Time</h3>
          <div className="stat-value"><span>3.2</span>m</div>
          <div className="stat-meta">↓ 0.4m from last week</div>
        </StatCard>
      </StatsGrid>

      <SectionHeader>
        <h2>⚡ Quick Actions</h2>
        <div className="section-actions">
  <Button className="secondary">View All</Button>
</div>


      </SectionHeader>

      <QuickActionsGrid>
        <QuickActionCard>
          <div className="icon">🍹</div>
          <div className="content">
            <h3>Add New Menu Item</h3>
            <p>Create seasonal drinks or update existing items</p>
          </div>
        </QuickActionCard>
        <QuickActionCard>
          <div className="icon">📊</div>
          <div className="content">
            <h3>Generate Reports</h3>
            <p>Sales, inventory, and customer analytics</p>
          </div>
        </QuickActionCard>
        <QuickActionCard>
          <div className="icon">📦</div>
          <div className="content">
            <h3>Manage Inventory</h3>
            <p>Update stock levels and place orders</p>
          </div>
        </QuickActionCard>
      </QuickActionsGrid>

      <DataGrid>
        <div>
          <SectionHeader>
            <h2>🏆 Top Products</h2>
            <Button className="secondary">View All</Button>
          </SectionHeader>
          <DataTable>
            {[
              { name: 'Caramel Iced Latte', sales: 76, revenue: '£342.50' },
              { name: 'Matcha Frappe', sales: 58, revenue: '£261.00' },
              { name: 'Cold Brew', sales: 42, revenue: '£189.00' },
              { name: 'Vanilla Cappuccino', sales: 39, revenue: '£175.50' },
              { name: 'Espresso Shot', sales: 35, revenue: '£87.50' },
            ].map((item, index) => (
              <div key={index} className="data-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: '500' }}>{index + 1}.</span>
                  <span>{item.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--primary)' }}>{item.sales} sold</span>
                  <span>{item.revenue}</span>
                </div>
              </div>
            ))}
          </DataTable>
        </div>

        <div>
          <SectionHeader>
            <h2>📝 Recent Activity</h2>
            <Button className="secondary">View All</Button>
          </SectionHeader>
          <Card>
            <ActivityList>
              <ActivityItem>
                <div className="timestamp">10:42 AM</div>
                <div className="activity-content">
                  <p>Inventory updated - 12 items restocked</p>
                  <div className="meta">By Admin User • Store #1</div>
                </div>
              </ActivityItem>
              <ActivityItem>
                <div className="timestamp">09:15 AM</div>
                <div className="activity-content">
                  <p>New seasonal menu item added</p>
                  <div className="meta">Pumpkin Spice Latte • £3.75</div>
                </div>
              </ActivityItem>
              <ActivityItem>
                <div className="timestamp">Yesterday</div>
                <div className="activity-content">
                  <p>Store #2 reported equipment issue</p>
                  <div className="meta">Espresso machine needs service</div>
                </div>
              </ActivityItem>
              <ActivityItem>
                <div className="timestamp">Yesterday</div>
                <div className="activity-content">
                  <p>Weekly sales report generated</p>
                  <div className="meta">PDF • 1.2MB</div>
                </div>
              </ActivityItem>
            </ActivityList>
          </Card>
        </div>
      </DataGrid>
    </DashboardContainer>
  );
}

export default AdminDashboard;