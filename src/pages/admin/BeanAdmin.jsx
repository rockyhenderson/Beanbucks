import React, { useState } from "react";
import styled from 'styled-components';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutline from '@mui/icons-material/HelpOutline';
import useFetchWithRetry from "../../utils/useFetchWithRetry";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

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
    color: var(--primary);
    
    span {
      color: var(--primary);
    }
  }

  .stat-meta {
    font-size: 0.85rem;
    margin-top: auto;
    
    &.positive {
      color: var(--success); /* green */
    }

    &.negative {
      color: var(--danger); /* red */
    }

    &.neutral {
      color: var(--text-secondary);
    }
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
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userRole = user?.role || "unknown";
  const userStoreId = user?.store_id || null;
  const sessionStoreId = sessionStorage.getItem("selectedStoreId");
  const [storeId, setStoreId] = useState(sessionStoreId || userStoreId || "");
  const [anchorEl, setAnchorEl] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  const {
    data: stores,
    error: storesError,
    retry: retryStores,
    isLoading: storesLoading,
  } = useFetchWithRetry(
    `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/public/read_stores.php`
  );
  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
    retry: retryStats,
  } = useFetchWithRetry(
    storeId
      ? `http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/get_admin_dashboard_stats.php?store_id=${storeId}`
      : null
  );
  const {
    data: topProducts,
    error: topProductsError,
    isLoading: topProductsLoading,
    retry: retryTopProducts
  } = useFetchWithRetry(
    "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/get_top_products.php"
  );

  const {
    data: recentLogs,
    error: recentLogsError,
    isLoading: recentLogsLoading,
    retry: retryRecentLogs
  } = useFetchWithRetry(
    "http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/get_recent_admin_logs.php"
  );

  const formatChange = (change) => {
    if (change === "∞") return "↑ ∞% from last week";
    const percent = Math.abs(change);
    if (change > 0) return `↑ ${percent}% from last week`;
    if (change < 0) return `↓ ${percent}% from last week`;
    return "→ No change";
  };
  const selectedStore =
    stores?.find((s) => s.id.toString() === storeId.toString()) || null;

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleSelectStore = (newId) => {
    setStoreId(newId);
    const selected = stores?.find((s) => s.id.toString() === newId);
    if (selected) {
      sessionStorage.setItem("selectedStoreId", newId);
      sessionStorage.setItem("selectedStoreName", selected.store_name);
    }
    handleCloseMenu();
  };
  // Mock top products
  const mockTopProducts = [
    { name: "Caramel Latte", total_sales: 128, price: 3.75 },
    { name: "Iced Americano", total_sales: 104, price: 2.95 },
    { name: "Matcha Frappe", total_sales: 97, price: 4.10 },
    { name: "Pumpkin Spice Latte", total_sales: 83, price: 3.95 },
    { name: "Chai Tea", total_sales: 76, price: 3.10 },
  ];

  // Mock recent activity
  const mockRecentLogs = [
    {
      id: 9991,
      admin_id: 3,
      object_id: 14,
      object_type: "User",
      description: "Updated permissions for barista Jane Doe",
      created_at: new Date().toISOString(),
    },
    {
      id: 9992,
      admin_id: 2,
      object_id: 22,
      object_type: "Drink",
      description: "Added new seasonal item: Gingerbread Mocha",
      created_at: new Date().toISOString(),
    },
    {
      id: 9993,
      admin_id: 1,
      object_id: 5,
      object_type: "Store",
      description: "Store #5 marked as closed due to low stock",
      created_at: new Date().toISOString(),
    },
  ];

  // Keep mockStats for fallback or development
  const mockStatsData = [
    {
      label: '💰 Weekly Revenue',
      value: '£1,842.50',
      meta: '↑ 12% from last week',
    },
    {
      label: '🛒 Total Orders',
      value: '342',
      meta: '↗ 24 new today',
    },
    {
      label: '👥 New Customers',
      value: '28',
      meta: '↗ 12% conversion rate',
    },
    {
      label: '🧪 Expiring Ingredients',
      value: '14',
      meta: '↑ 3 since last week',
    },
  ];

  // Use real data if available, fallback to mock
  const statsData = useMockData || !stats?.success
    ? [
      {
        label: '💰 Weekly Revenue',
        value: '£1,842.50',
        meta: '↑ 12% from last week',
      },
      {
        label: '🛒 Total Orders',
        value: '342',
        meta: '↗ 24 new today',
      },
      {
        label: '👥 New Customers',
        value: '28',
        meta: '↗ 12% conversion rate',
      },
      {
        label: '🧪 Expiring Ingredients',
        value: '14',
        meta: '↑ 3 since last week',
      },
    ]
    : [
      {
        label: "💰 Weekly Revenue",
        value: `£${stats.data.weekly_revenue.toFixed(2)}`,
        meta: formatChange(stats.data.revenue_change),
      },
      {
        label: "🛒 Total Orders",
        value: `${stats.data.order_count}`,
        meta: formatChange(stats.data.order_change),
      },
      {
        label: "👥 New Customers",
        value: `${stats.data.new_customers}`,
        meta: formatChange(stats.data.customer_change),
      },
      {
        label: "🧪 Expiring Ingredients",
        value: `${stats.data.expiring_ingredients}`,
        meta: "⚠️ Next 3 days",
      },
    ];





  const statTooltips = {
    '💰 Weekly Revenue': 'Total income from all orders placed in the last 7 days.',
    '🛒 Total Orders': 'Total number of orders completed in the last 7 days.',
    '👥 New Customers': 'Number of unique new customers who ordered this week.',
    '🧪 Expiring Ingredients': `Ingredients set to expire within the next 3 days.

Track these to avoid waste and ensure stock quality.`,
  };


  const getStatMetaClass = (text) => {
    if (text.includes('↑') || text.includes('↗')) return 'positive';
    if (text.includes('↓') || text.includes('↘')) return 'negative';
    return 'neutral';
  };

  const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;

  .tooltip-text {
    visibility: hidden;
    width: 220px;
    background-color: var(--tooltip-bg, #333);
    color: #fff;
    text-align: left;
    border-radius: 6px;
    padding: 0.5rem;
    position: absolute;
    z-index: 10;
    bottom: 125%; /* Position above */
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 0.75rem;
    line-height: 1.2;
    white-space: normal;
  }

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }

  .tooltip-icon {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-left: 0.25rem;
  }
`;
  const MockButton = styled.button`
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 0.55rem 1rem;
  border-radius: 6px;
  border: 2px solid #28a745;
  cursor: pointer;
  text-transform: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #28a745;
    color: white;
    border-color: #28a745;
  }
`;

  if (statsLoading) return <p>Loading stats...</p>;
  if (statsError) {
    return (
      <div style={{ color: 'red', marginBottom: '1rem' }}>
        <p>Failed to load stats.</p>
        <button onClick={retryStats}>Retry</button>
      </div>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <h1>📊 Admin Dashboard</h1>
          <Tooltip
            title={
              useMockData
                ? "Click to switch back to real-time stats from the backend API."
                : "Click to view example data for testing UI without live backend."
            }
            arrow
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "var(--card)",
                  color: "var(--text)",
                  border: "1px solid var(--component-border)",
                  boxShadow: 2,
                  px: 2,
                  py: 1,
                  fontSize: "0.85rem",
                  maxWidth: 260,
                  lineHeight: 1.4,
                },
              },
            }}
          >
            <span>
              <MockButton onClick={() => setUseMockData((prev) => !prev)}>
                {useMockData ? "LIVE DATA" : "MOCK DATA"}
              </MockButton>
            </span>
          </Tooltip>

        </div>
      </Header>

      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Your Selected Store
        </p>

        <div
          onClick={userRole === "manager" ? handleOpenMenu : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: userRole === "manager" ? "pointer" : "default",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--component-border)",
            width: "fit-content",
          }}
        >
          <span style={{ fontWeight: "600", color: "var(--primary)", marginRight: "0.5rem" }}>
            {selectedStore ? selectedStore.store_name : "Unknown Store"}
          </span>
          {userRole === "manager" && <ArrowDropDownIcon fontSize="medium" />}
        </div>

        {userRole === "manager" && (
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            {stores?.map((store) => (
              <MenuItem key={store.id} onClick={() => handleSelectStore(store.id.toString())}>
                {store.store_name}
              </MenuItem>
            ))}
          </Menu>
        )}
      </div>

      <StatsGrid>
        {statsData.map(({ label, value, meta }, index) => (
          <StatCard key={index}>
            <h3>
              {label}
              <Tooltip
                title={
                  <div style={{ fontSize: "0.9rem", lineHeight: 1.4, maxWidth: 220 }}>
                    {statTooltips[label]}
                  </div>
                }
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "var(--card)",
                      color: "var(--text)",
                      border: "1px solid var(--component-border)",
                      boxShadow: 2,
                      px: 2,
                      py: 1,
                    },
                  },
                }}
              >
                <IconButton size="small" sx={{ color: "var(--text)", p: 0, ml: 0.5 }}>
                  <HelpOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            </h3>
            <div className="stat-value">{value}</div>
            <div className={`stat-meta ${getStatMetaClass(meta)}`}>{meta}</div>
          </StatCard>
        ))}
      </StatsGrid>



      <SectionHeader>
        <h2>⚡ Quick Actions</h2>


      </SectionHeader>

      <QuickActionsGrid>
        <QuickActionCard onClick={() => window.location.href = "/admin/managemenu"}>
          <div className="icon">📋</div>
          <div className="content">
            <h3>Manage Menu</h3>
            <p>Update drinks and categories</p>
          </div>
        </QuickActionCard>

        <QuickActionCard onClick={() => window.location.href = "/admin/manageusers"}>
          <div className="icon">👥</div>
          <div className="content">
            <h3>Manage Users</h3>
            <p>Edit, delete, or add staff</p>
          </div>
        </QuickActionCard>

        <QuickActionCard onClick={() => window.location.href = "admin/baristaPortal"}>
          <div className="icon">☕</div>
          <div className="content">
            <h3>Barista Portal</h3>
            <p>Real-time order updates</p>
          </div>
        </QuickActionCard>

        <QuickActionCard onClick={() => window.location.href = "/admin/managestores"}>
          <div className="icon">🏪</div>
          <div className="content">
            <h3>Store Options</h3>
            <p>Customize hours and open status</p>
          </div>
        </QuickActionCard>

        <QuickActionCard onClick={() => window.location.href = "/admin/adminstock"}>
          <div className="icon">📦</div>
          <div className="content">
            <h3>Manage Stock</h3>
            <p>Track and update ingredient levels</p>
          </div>
        </QuickActionCard>

        <QuickActionCard onClick={() => window.location.href = "/admin/adminlogs"}>
          <div className="icon">📝</div>
          <div className="content">
            <h3>View Logs</h3>
            <p>Review admin activity</p>
          </div>
        </QuickActionCard>
      </QuickActionsGrid>


      <DataGrid>
        <div>
          <SectionHeader>
            <h2>🏆 Top Products</h2>
            <Button
              className="secondary"
              onClick={() => {
                window.location.href = "/admin/managemenu";
              }}
            >
              View All
            </Button>
          </SectionHeader>
          <DataTable>
            {(useMockData ? mockTopProducts : topProducts?.data || []).map((item, index) => (
              <div key={index} className="data-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: '500' }}>{index + 1}.</span>
                  <span>{item.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ color: 'var(--primary)' }}>{item.total_sales} sold</span>
                  <span>£{parseFloat(item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}


          </DataTable>
        </div>

        <div>
          <SectionHeader>
            <h2>📝 Recent Activity</h2>
            <Button
              className="secondary"
              onClick={() => {
                window.location.href = "/admin/adminlogs";
              }}
            >
              View All
            </Button>
          </SectionHeader>

          <Card>
            <ActivityList>
              {(useMockData ? mockRecentLogs : recentLogs?.data || []).map((log, index) => (
                <ActivityItem key={index}>
                  <div className="timestamp">
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="activity-content">
                    <p>{log.description}</p>
                    <div className="meta">
                      {`By Admin ID #${log.admin_id} • ${log.object_type} #${log.object_id}`}
                    </div>
                  </div>
                </ActivityItem>
              ))}

            </ActivityList>

          </Card>
        </div>
      </DataGrid>
    </DashboardContainer>
  );
}

export default AdminDashboard;