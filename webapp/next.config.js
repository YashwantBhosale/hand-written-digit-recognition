/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone", // For Vercel deployment
	async rewrites() {
		console.log("VERCEL_ENV:", process.env.VERCEL_ENV); // This will help debug the issue
		return [
			{
				source: "/api/:path*",
				destination:
					process.env.VERCEL_ENV === "production"
						? "https://hand-written-digit-recognition-delta.vercel.app/api/:path*"
						: "http://localhost:5328/api/:path*",
			},
		];
	},
};

module.exports = nextConfig;
