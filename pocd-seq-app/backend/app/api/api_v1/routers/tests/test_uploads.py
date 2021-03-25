
# def test_upload_file(client, test_superuser, superuser_token_headers):
#     response = client.get("/api/v1/users", headers=superuser_token_headers)
#     assert response.status_code == 200
#     assert response.json() == [
#         {
#             "id": test_superuser.id,
#             "email": test_superuser.email,
#             "is_active": test_superuser.is_active,
#             "is_superuser": test_superuser.is_superuser,
#         }
#     ]

 
