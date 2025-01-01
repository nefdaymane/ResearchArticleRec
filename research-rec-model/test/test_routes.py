import unittest
from app import create_app

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app().test_client()
    
    def test_index(self):
        response = self.app.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json)
        self.assertEqual(response.json["message"], "Welcome to the AI model app!")
