import aiohttp
from typing import Optional, Dict, Any, List
from config import settings


class BackendClient:
    def __init__(self):
        self.base_url = settings.BACKEND_URL
        self.timeout = aiohttp.ClientTimeout(total=settings.REQUEST_TIMEOUT)

    async def _request(
        self,
        method: str,
        path: str,
        token: Optional[str] = None,
        data: Optional[Dict] = None,
        json_data: Optional[Dict] = None,
    ) -> Dict[str, Any]:

        url = f"{self.base_url}{path}"

        headers = {}

        if token:
            headers["Authorization"] = f"Bearer {token}"

        async with aiohttp.ClientSession(timeout=self.timeout) as session:
            async with session.request(
                method=method,
                url=url,
                headers=headers,
                data=data,
                json=json_data,
            ) as resp:

                if resp.status >= 400:
                    text = await resp.text()
                    raise Exception(f"Backend error {resp.status}: {text}")

                return await resp.json()

    # ---------- Auth ----------

    async def login(self, username: str, password: str) -> str:
        result = await self._request(
            "POST",
            "/api/auth/login/json",
            json_data={
                "username": username,
                "password": password,
            },
        )

        return result["access_token"]

    # ---------- Videos ----------

    async def get_videos(self, token: str, params: Optional[Dict] = None):
        return await self._request(
            "GET",
            "/api/videos",
            token=token,
            data=params,
        )

    async def upload_video(
        self,
        token: str,
        title: str,
        description: str,
        category_id: int,
        file_path: str,
        thumbnail_path: Optional[str] = None,
    ):

        form = aiohttp.FormData()

        form.add_field("title", title)
        form.add_field("description", description)
        form.add_field("category_id", str(category_id))

        with open(file_path, "rb") as f:
            form.add_field(
                "file",
                f,
                filename=file_path.split("/")[-1],
            )

            if thumbnail_path:
                with open(thumbnail_path, "rb") as t:
                    form.add_field(
                        "thumbnail",
                        t,
                        filename=thumbnail_path.split("/")[-1],
                    )

                    return await self._request(
                        "POST",
                        "/api/videos/",
                        token=token,
                        data=form,
                    )

            return await self._request(
                "POST",
                "/api/videos/",
                token=token,
                data=form,
            )

    async def delete_video(self, token: str, video_id: int):
        return await self._request(
            "DELETE",
            f"/api/videos/{video_id}",
            token=token,
        )

    async def edit_video(self, token: str, video_id: int, data: Dict):
        return await self._request(
            "PUT",
            f"/api/videos/{video_id}",
            token=token,
            json_data=data,
        )

    # ---------- Categories ----------

    async def get_categories(self, token: str):
        return await self._request(
            "GET",
            "/api/categories",
            token=token,
        )

    async def create_category(self, token: str, name: str):
        return await self._request(
            "POST",
            "/api/categories",
            token=token,
            json_data={"name": name},
        )

    async def delete_category(self, token: str, category_id: int):
        return await self._request(
            "DELETE",
            f"/api/categories/{category_id}",
            token=token,
        )

    # ---------- Ads ----------

    async def get_ads(self, token: str):
        return await self._request(
            "GET",
            "/api/ads",
            token=token,
        )

    async def create_ad(self, token: str, ad_data: Dict):
        return await self._request(
            "POST",
            "/api/ads",
            token=token,
            json_data=ad_data,
        )

    async def delete_ad(self, token: str, ad_id: int):
        return await self._request(
            "DELETE",
            f"/api/ads/{ad_id}",
            token=token,
        )

    # ---------- Admin ----------

    async def get_dashboard(self, token: str):
        return await self._request(
            "GET",
            "/api/admin/dashboard",
            token=token,
        )

    async def get_analytics(self, token: str):
        return await self._request(
            "GET",
            "/api/analytics/stats",
            token=token,
        )

    # ---------- Users ----------

    async def get_users(self, token: str):
        return await self._request(
            "GET",
            "/api/users",
            token=token,
        )

    # ---------- Settings ----------

    async def get_settings(self, token: str):
        return await self._request(
            "GET",
            "/api/settings",
            token=token,
        )

    async def update_settings(self, token: str, data: Dict):
        return await self._request(
            "PUT",
            "/api/settings",
            token=token,
            json_data=data,
        )


backend = BackendClient()
