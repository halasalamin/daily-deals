import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import companyRouter from './routes/companyRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import favoriteRouter from './routes/favoriteRoute.js'
import CategoryRouter from './routes/categoryRoute.js'
import adminRouter from './routes/adminRoute.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import adsRouter from "./routes/adsRoute.js";
import "./cronJobs/deleteExpiredAds.js"; 
import predictRouter from './routes/predictRoute.js'
// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for your e-commerce application',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server',
      },
      {
        url: `https://your-production-url.com`, 
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


// Middleware
app.use(express.json())

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // if you need cookies or auth headers
}));

app.options("*", cors());

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use("/api/companies", companyRouter);
app.use("/api/reviews", reviewRouter);
app.use('/api/admin', adminRouter);
app.use("/api/favorites", favoriteRouter);
app.use('/api/categories', CategoryRouter);
app.use("/api/ads",adsRouter);
app.use("/api/report", predictRouter);
app.use('/uploads', express.static('uploads'));


// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: 
 *     responses:
 *       200:
 *         description: 
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 
 */
  
app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
  console.log('Server Started on PORT : ' + port)
  console.log(`Swagger docs available at http://127.0.0.1:${port}/api-docs`)
})