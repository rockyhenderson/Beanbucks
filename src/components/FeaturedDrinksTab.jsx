import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
  Chip,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import {
  LocalCafe,
  Star,
  StarBorder,
  Search,
  ArrowBackIosNew,
  ArrowForwardIos,
  Info
} from "@mui/icons-material";

import noImage from '../../public/img/Fallback.png';
import FeaturedDrinkCard from "../components/FeaturedDrinkCard";
import Toast from ".//Toast"; 



const MAX_FEATURED = 10;

function FeaturedDrinksTab() {
  const isTablet = useMediaQuery('(max-width:1200px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const [allDrinks, setAllDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const drinksPerPage = isMobile ? 5 : 8;
  const [toast, setToast] = useState(null);


  // Filter drinks based on search term
  const filteredDrinks = allDrinks.filter(drink =>
    drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drink.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredDrinks = allDrinks.filter(drink => drink.featured);
  const nonFeaturedDrinks = filteredDrinks.filter(drink => !drink.featured);

  // Pagination logic
  const pageCount = Math.ceil(nonFeaturedDrinks.length / drinksPerPage);
  const paginatedDrinks = nonFeaturedDrinks.slice(
    (currentPage - 1) * drinksPerPage,
    currentPage * drinksPerPage
  );
  const toggleFeatured = async (id) => {
    const current = allDrinks.find(d => d.id === id);
    const newStatus = !current.featured;

    try {
      const response = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/toggle_featured.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drink_id: id, featured: newStatus })
      });

      if (!response.ok) throw new Error("Failed to toggle featured status");

      const result = await response.json();

      setAllDrinks(prev =>
        prev.map(drink =>
          drink.id === id ? { ...drink, featured: newStatus } : drink
        )
      );

      setToast({
        type: "success",
        title: "Updated",
        message: result.message || "Drink status updated",
      });

    } catch (err) {
      console.error("Toggle error:", err);
      setToast({
        type: "error",
        title: "Update Failed",
        message: err.message || "Could not update featured status",
      });
    }
  };



  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch("http://webdev.edinburghcollege.ac.uk/HNCWEBMR10/yearTwo/semester2/BeanBucks-API/api/admin/drinks/get_active_drinks.php");
        if (!response.ok) throw new Error("Failed to fetch drinks");
        const data = await response.json();

        setAllDrinks(data);
      } catch (err) {
        console.error("Error fetching drinks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);
  const truncateDescription = (text, wordLimit = 10) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };
  const previewDrinks = featuredDrinks.slice(0, 1);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);


  // Drag gesture handler


  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % previewDrinks.length;
    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + previewDrinks.length) % previewDrinks.length;
    setActiveIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  const scrollToIndex = (index) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const card = container.children[index];
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };



  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'var(--body-text)' }}>
          Loading drinks...
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{

      maxWidth: '1400px',
      mx: 'auto',
      background: 'var(--background)'
    }}>
      {toast && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1500,
          }}
        >
          <Toast {...toast} onClose={() => setToast(null)} />
        </Box>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>

        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{
            fontWeight: 800,
            color: 'var(--heading-color)',
            lineHeight: 1
          }}>
            Featured Drinks
          </Typography>
          <Typography variant="body1" sx={{
            color: 'var(--body-text)',
            mt: 0.5,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}>
            Highlight up to {MAX_FEATURED} drinks on your homepage
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={isMobile ? 1 : 3}
        sx={{
          mb: 4,
          p: isMobile ? 2 : 3,
          borderRadius: '12px',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--component-border)'
        }}
      >
        {/* Section Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{
            fontWeight: 600,
            color: 'var(--heading-color)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Star sx={{ color: '#ee5c01', mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} />
            Customer Preview
          </Typography>
          <Chip
            label={`${featuredDrinks.length}/${MAX_FEATURED}`}
            size="small"
            sx={{
              ml: 2,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              backgroundColor: featuredDrinks.length >= MAX_FEATURED
                ? 'rgba(238, 92, 1, 0.2)'
                : 'rgba(0, 0, 0, 0.1)',
              color: featuredDrinks.length >= MAX_FEATURED
                ? '#ee5c01'
                : 'var(--text)'
            }}
          />

        </Box>

        {/* Preview Card */}
        {previewDrinks.length > 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FeaturedDrinkCard drink={previewDrinks[0]} />
          </Box>
        ) : (
          <Box sx={{
            py: 3,
            textAlign: 'center',
            border: '1px dashed var(--component-border)',
            borderRadius: '8px'
          }}>
            <Typography sx={{
              color: 'var(--body-text)',
              fontStyle: 'italic',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}>
              No featured drinks selected yet
            </Typography>
          </Box>
        )}
      </Paper>


      {/* Management Section - Stacked on mobile */}
      <Grid container spacing={isTablet ? 0 : 3} direction={isTablet ? "column" : "row"}>
        {/* Featured Drinks Column - Full width on mobile */}
        <Grid item xs={12} md={5} lg={5}>
          <Paper sx={{
            p: isMobile ? 2 : 3,
            mb: isMobile ? 3 : 0,
            borderRadius: '12px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--component-border)'
          }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{
              fontWeight: 600,
              mb: 2,
              color: 'var(--heading-color)'
            }}>
              Featured Drinks
            </Typography>

            {featuredDrinks.length > 0 ? (
              <Box sx={{
                maxHeight: isMobile ? '300px' : '500px',
                overflowY: 'auto',
                pr: 1
              }}>
                {featuredDrinks.map(drink => (
                  <Paper
                    key={drink.id}
                    sx={{
                      p: 1.5,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'rgba(238, 92, 1, 0.05)',
                      border: '1px solid rgba(238, 92, 1, 0.3)',
                      borderRadius: '8px',
                    }}
                  >
                    <Avatar
                      src={noImage}
                      alt={drink.name}
                      sx={{
                        width: isMobile ? 60 : 80,
                        height: isMobile ? 60 : 80,
                        mr: 2,
                        border: '2px solid #ee5c01',
                      }}
                    />

                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                      <Typography sx={{
                        fontWeight: 600,
                        color: 'var(--accent)',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {drink.name}
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: 'var(--body-text)',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}>
                        {truncateDescription(drink.desc)}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => toggleFeatured(drink.id)}
                      size={isMobile ? "small" : "medium"}
                      sx={{ color: '#ee5c01' }}
                    >
                      <Star fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{
                py: 2,
                textAlign: 'center',
                border: '1px dashed var(--component-border)',
                borderRadius: '8px'
              }}>
                <Typography sx={{
                  color: 'var(--body-text)',
                  fontStyle: 'italic',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  No drinks currently featured
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Available Drinks Column - Full width on mobile */}
        <Grid
          item
          xs={12}
          md={7}
          lg={7}
          sx={{
            mt: isTablet ? 3 : 0
          }}
        >

          <Paper sx={{
            p: isMobile ? 2 : 3,
            borderRadius: '12px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--component-border)'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              mb: 2,
              gap: isMobile ? 1 : 2
            }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{
                fontWeight: 600,
                color: 'var(--heading-color)'
              }}>
                Available Drinks ({nonFeaturedDrinks.length})
              </Typography>

              <TextField
                placeholder="Search drinks..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{
                  width: isMobile ? '100%' : '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: 'var(--background)'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'var(--body-text)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {paginatedDrinks.length > 0 ? (
              <>
                <Box sx={{ mb: 2 }}>
                  {paginatedDrinks.map(drink => (
                    <Paper
                      key={drink.id}
                      sx={{
                        p: 1.5,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--component-border)',
                        borderRadius: '8px',
                      }}
                    >
                      <Avatar
                        src={noImage}
                        alt={drink.name}
                        sx={{
                          width: isMobile ? 60 : 80,
                          height: isMobile ? 60 : 80,
                          mr: 2,
                          border: '2px solid #ee5c01',
                        }}
                      />

                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography sx={{
                          fontWeight: 600,
                          color: 'var(--text)',
                          fontSize: isMobile ? '0.875rem' : '1rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {drink.name}
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: 'var(--body-text)',
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}>
                          {truncateDescription(drink.desc)}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => toggleFeatured(drink.id)}
                        disabled={featuredDrinks.length >= MAX_FEATURED}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          color: featuredDrinks.length >= MAX_FEATURED ? 'var(--body-text)' : 'var(--text)',
                          opacity: featuredDrinks.length >= MAX_FEATURED ? 0.5 : 1
                        }}
                      >
                        <StarBorder fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                    </Paper>
                  ))}
                </Box>

                {pageCount > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Pagination
                      count={pageCount}
                      page={currentPage}
                      onChange={(e, page) => setCurrentPage(page)}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: 'var(--text)',
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        },
                        '& .Mui-selected': {
                          backgroundColor: '#ee5c01 !important',
                          color: 'white'
                        }
                      }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{
                py: 3,
                textAlign: 'center',
                border: '1px dashed var(--component-border)',
                borderRadius: '8px'
              }}>
                <Typography sx={{
                  color: 'var(--body-text)',
                  fontStyle: 'italic',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}>
                  {searchTerm ? `No drinks found matching "${searchTerm}"` : 'No drinks available'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FeaturedDrinksTab;